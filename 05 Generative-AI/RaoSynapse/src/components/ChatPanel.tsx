import { useEffect, useRef, useState, type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, ArrowUp, Bot, Check, CheckCheck, Clipboard, LoaderCircle, LockKeyhole, RefreshCw, Square, UserRound, UsersRound } from 'lucide-react';
import { api, clientId, copyText, json, streamAI, toast } from '../lib/api';
import { useRealtime } from '../lib/realtime';
import { useAuth } from '../lib/auth';
import type { Conversation, Message } from '../types';
import { Avatar, EmptyState, Modal, Spinner } from './UI';
import { cx, messageTime } from '../lib/utils';

export default function ChatPanel({ conversationId, mode, actions, onChanged, onDeleted, onBack, initialDraft = '', autoStart = false, onDraftConsumed }: {
  conversationId: string;
  mode: 'ai' | 'direct' | 'room';
  actions?: ReactNode;
  onChanged?: () => void;
  onDeleted?: () => void;
  onBack?: () => void;
  initialDraft?: string;
  autoStart?: boolean;
  onDraftConsumed?: () => void;
}) {
  const { user } = useAuth();
  const { addListener, send } = useRealtime();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [input, setInput] = useState(initialDraft);
  const [sending, setSending] = useState(false);
  const [askAI, setAskAI] = useState(mode === 'ai');
  const [contactOpen, setContactOpen] = useState(false);
  const abort = useRef<AbortController | null>(null);
  const autoStartPending = useRef(autoStart && !!initialDraft.trim());
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const activeId = useRef(conversationId);
  activeId.current = conversationId;

  const load = async (quiet = false) => {
    if (!quiet) setLoading(true);
    setError('');
    try {
      const result = await api<{ conversation: Conversation }>(`/api/conversations/${conversationId}`);
      if (activeId.current !== conversationId) return;
      setConversation(result.conversation);
      const last = result.conversation.messages?.at(-1)?.sequence || 0;
      if (last > 0) api(`/api/conversations/${conversationId}/read`, { method: 'POST', body: json({ sequence: last }) }).then(onChanged).catch(() => {});
    } catch (err: any) {
      setError(err.message || 'Could not load this conversation.');
    } finally { if (activeId.current === conversationId) setLoading(false); }
  };

  useEffect(() => {
    setConversation(null);
    setInput(initialDraft);
    setAskAI(mode === 'ai');
    setContactOpen(false);
    abort.current?.abort();
    load();
    return () => abort.current?.abort();
  }, [conversationId]);

  useEffect(() => addListener(event => {
    if (event.type === 'presence' && mode === 'direct') {
      setConversation(current => current ? { ...current, members: current.members.map(member => member.id === event.userId ? { ...member, online: event.online } : member) } : current);
      return;
    }
    if (event.conversationId !== conversationId) return;
    if (event.type === 'message_created' || event.type === 'message_updated') {
      setConversation(current => current ? { ...current, messages: upsert(current.messages || [], event.message) } : current);
      if (event.type === 'message_created' && event.message.senderId !== user!.id && mode === 'direct') {
        send({ type: 'delivered', conversationId, sequence: event.message.sequence });
        api(`/api/conversations/${conversationId}/read`, { method: 'POST', body: json({ sequence: event.message.sequence }) }).catch(() => {});
      }
      onChanged?.();
    }
    if (event.type === 'conversation_updated') {
      setConversation(current => current ? { ...current, title: event.title, archived: event.archived } : current);
      onChanged?.();
    }
    if (event.type === 'receipt_updated') {
      setConversation(current => {
        if (!current) return current;
        const members = current.members.map(member => member.id === event.userId ? {
          ...member,
          lastReadSequence: Math.max((member as any).lastReadSequence || 0, event.readSequence || 0),
          lastDeliveredSequence: Math.max((member as any).lastDeliveredSequence || 0, event.deliveredSequence || 0),
        } : member);
        const messages = (current.messages || []).map(message => ({ ...message, delivery: deliveryFor(message, members, user!.id) }));
        return { ...current, members, messages };
      });
    }
    if (['member_added', 'member_updated', 'member_removed'].includes(event.type)) load(true);
    if (event.type === 'conversation_deleted') onDeleted?.();
  }), [conversationId, user?.id, mode]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: conversation?.messages?.some(m => m.status === 'streaming') ? 'auto' : 'smooth', block: 'end' });
  }, [conversation?.messages?.length, conversation?.messages?.at(-1)?.content]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
    }
  }, [input]);

  const submit = async () => {
    const content = input.trim();
    if (!content || sending || !conversation) return;
    const wantsAI = mode === 'ai' || (mode === 'room' && askAI);
    setSending(true);
    setError('');
    if (wantsAI) {
      const controller = new AbortController();
      abort.current = controller;
      setInput('');
      try {
        await streamAI(conversationId, content, clientId(), controller.signal, event => {
          if (event.type === 'start') {
            setConversation(current => current ? { ...current, messages: upsert(upsert(current.messages || [], event.userMessage), event.assistantMessage) } : current);
          }
          if (event.type === 'delta') {
            setConversation(current => current ? { ...current, messages: (current.messages || []).map(message => message.id === event.messageId ? { ...message, content: message.content + event.content, status: 'streaming' } : message) } : current);
          }
          if (event.type === 'done') {
            setConversation(current => current ? { ...current, messages: upsert(current.messages || [], event.message) } : current);
            if (event.error) toast(event.error, 'info');
          }
        });
        onChanged?.();
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'AI request failed.');
          setInput(content);
        }
        await load(true);
      } finally {
        abort.current = null;
        setSending(false);
      }
    } else {
      try {
        const result = await api<{ message: Message }>(`/api/conversations/${conversationId}/messages`, { method: 'POST', body: json({ content, clientId: clientId() }) });
        setConversation(current => current ? { ...current, messages: upsert(current.messages || [], result.message) } : current);
        setInput('');
        onChanged?.();
      } catch (err: any) {
        setError(err.message || 'Message could not be sent.');
      } finally { setSending(false); }
    }
  };

  useEffect(() => {
    if (!autoStartPending.current || loading || !conversation || !input.trim() || sending) return;
    autoStartPending.current = false;
    onDraftConsumed?.();
    void submit();
  }, [loading, conversation?.id, input, sending]);

  if (loading) return <div className="chat-loading"><Spinner /><span>Restoring conversation…</span></div>;
  if (error && !conversation) return <EmptyState title="Conversation unavailable" description={error} action={<button className="button secondary" onClick={() => load()}><RefreshCw size={16} />Try again</button>} />;
  if (!conversation) return null;

  const messages = conversation.messages || [];
  const viewer = conversation.role === 'viewer';
  const other = mode === 'direct' ? conversation.members.find(member => member.id !== user!.id) : null;

  return <>
    <section className="chat-panel">
    <header className="chat-header">
      {onBack && <button className="icon-button chat-back" onClick={onBack} aria-label="Back to conversations"><ArrowLeft size={19} /></button>}
      <div className="chat-title-block">
        {mode === 'direct' && other ? <Avatar name={other.displayName} color={other.avatarColor} online={other.online} /> : <span className={cx('chat-header-icon', `type-${mode}`)}>{mode === 'room' ? <UsersRound size={19} /> : <Bot size={19} />}</span>}
        <div><h2>{other?.displayName || conversation.title}</h2><p>{mode === 'ai' ? 'Private AI conversation' : mode === 'room' ? `${conversation.members.length} members · Shared context` : <><span className={cx('direct-header-presence', other?.online && 'online')} />{other?.online ? 'Online now' : 'Offline'} · @{other?.username || 'member'}</>}</p></div>
      </div>
      <div className="chat-actions">{mode === 'direct' && other && <button className="button compact secondary direct-contact-button" onClick={() => setContactOpen(true)}><UserRound size={15} /><span className="hide-small">Contact</span></button>}{actions}</div>
    </header>
    <div className="message-scroll" aria-live="polite">
      {mode === 'room' && <div className="context-notice"><LockKeyhole size={14} /><span>Room AI uses only this room’s recent messages. Your private conversations stay separate.</span></div>}
      {messages.length === 0 && <div className="chat-welcome">
        <span className="welcome-orb"><Bot size={29} /></span>
        <h3>{mode === 'ai' ? 'Where should we begin?' : mode === 'room' ? 'Start the shared timeline' : 'Start a private conversation'}</h3>
        <p>{mode === 'ai' ? 'Ask a question, explore an idea, or work through a problem. Your conversation is saved as you go.' : mode === 'room' ? 'Write to the group or enable Ask AI to generate from shared room context.' : 'Messages are persisted before they are marked as sent.'}</p>
      </div>}
      <div className="message-list">
        {messages.map((message, index) => {
          const previous = messages[index - 1];
          const grouped = previous && previous.senderId === message.senderId && previous.role === message.role;
          const own = message.senderId === user!.id;
          return <article key={message.id} className={cx('message-row', own && 'own', message.role === 'assistant' && 'assistant', grouped && 'grouped')}>
            <div className="message-avatar">{message.role === 'assistant' ? <span className="ai-avatar"><Bot size={17} /></span> : !grouped ? <Avatar name={message.senderName} color={message.avatarColor} size="sm" /> : null}</div>
            <div className="message-body">
              {!grouped && <div className="message-meta"><strong>{own ? 'You' : message.senderName}</strong><time>{messageTime(message.createdAt)}</time>{message.model === 'preview-responder' && <span className="preview-label">Preview</span>}</div>}
              <div className={cx('message-content', message.status === 'failed' && 'failed')}>
                {message.content ? <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: ({ ...props }) => <a {...props} target="_blank" rel="noreferrer noopener" /> }}>{message.content}</ReactMarkdown> : message.status === 'failed' ? <span className="failed-empty">I couldn't complete that response. Try sending the prompt again.</span> : <span className="thinking"><i /><i /><i />Thinking</span>}
                {message.status === 'streaming' && message.content && <span className="stream-cursor" />}
              </div>
              <div className="message-footer">
                {message.status === 'partial' && <span className="message-state warning">Partial response</span>}
                {message.status === 'failed' && <span className="message-state error">Not completed</span>}
                {message.status === 'sending' && <span className="message-state">Sending…</span>}
                {message.role === 'assistant' && message.content && <button onClick={() => copyText(message.content, 'Response copied')} aria-label="Copy response"><Clipboard size={13} />Copy</button>}
                {mode === 'direct' && own && message.status !== 'sending' && <span className="delivery-state" title={message.delivery}>{message.delivery === 'sent' ? <Check size={14} /> : <CheckCheck size={14} className={message.delivery === 'read' ? 'read' : ''} />}<span>{message.delivery}</span></span>}
              </div>
            </div>
          </article>;
        })}
      </div>
      <div ref={endRef} />
    </div>
    <div className="composer-area">
      {error && <div className="inline-error" role="alert">{error}<button onClick={() => setError('')}>Dismiss</button></div>}
      {viewer ? <div className="viewer-notice"><LockKeyhole size={16} />You have viewer access. Ask the room owner for editor access to contribute.</div> : <>
        {mode === 'room' && askAI && <div className="ask-ai-notice"><Bot size={14} />Ask AI is on — this prompt and response will be visible to room members.</div>}
        <div className={cx('composer', askAI && mode === 'room' && 'ai-composer')}>
          {mode === 'room' && <button className={cx('composer-tool', askAI && 'active')} onClick={() => setAskAI(value => !value)} title="Toggle Ask AI" aria-label="Toggle Ask AI"><Bot size={19} /></button>}
          <textarea ref={textareaRef} rows={1} value={input} disabled={sending && !abort.current} onChange={event => setInput(event.target.value)} onKeyDown={event => {
            if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); submit(); }
          }} placeholder={mode === 'ai' ? 'Ask Synapse anything…' : mode === 'room' ? (askAI ? 'Ask AI from this room’s context…' : 'Contribute to the room…') : 'Write a private message…'} aria-label="Message composer" />
          {sending && abort.current ? <button className="send-button stop" onClick={() => abort.current?.abort()} aria-label="Stop generation"><Square size={15} fill="currentColor" /></button> : <button className="send-button" disabled={!input.trim() || sending} onClick={submit} aria-label={mode === 'ai' || askAI ? 'Send to AI' : 'Send message'}>{sending ? <LoaderCircle size={17} className="spin" /> : <ArrowUp size={18} />}</button>}
        </div>
        <div className="composer-hint"><span>{mode === 'direct' ? 'Private between members' : 'Enter to send · Shift + Enter for a new line'}</span><span>{input.length > 0 && `${input.length} / ${mode === 'direct' ? '8,000' : '12,000'}`}</span></div>
      </>}
    </div>
    </section>
    {contactOpen && other && <Modal title={other.displayName} description="Private message contact" onClose={() => setContactOpen(false)}>
      <div className="direct-contact-modal"><div className="direct-contact-modal-hero"><Avatar name={other.displayName} color={other.avatarColor} size="lg" online={other.online} /><div><span className={cx('contact-presence', other.online && 'online')}>{other.online ? 'Online now' : 'Offline'}</span><h3>{other.displayName}</h3><p>@{other.username}</p></div></div><p className="direct-contact-bio">{other.bio || 'This member has not added a bio yet.'}</p><div className="direct-contact-facts"><div><span>Member since</span><strong>{new Date(other.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</strong></div><div><span>Conversation</span><strong>Private between two members</strong></div></div><div className="contact-privacy-note"><LockKeyhole size={15} /><span>Access-controlled, not end-to-end encrypted. Delivery and read states appear beneath your messages.</span></div></div>
    </Modal>}
  </>;
}

function upsert(messages: Message[], incoming: Message) {
  const index = messages.findIndex(message => message.id === incoming.id);
  if (index === -1) return [...messages, incoming].sort((a, b) => a.sequence - b.sequence);
  const next = [...messages];
  next[index] = incoming;
  return next;
}

function deliveryFor(message: Message, members: any[], userId: string): Message['delivery'] {
  if (message.senderId !== userId || message.status === 'sending') return message.delivery;
  const others = members.filter(member => member.id !== userId);
  if (!others.length) return 'sent';
  if (others.every(member => (member.lastReadSequence || 0) >= message.sequence)) return 'read';
  if (others.every(member => (member.lastDeliveredSequence || 0) >= message.sequence)) return 'delivered';
  return 'sent';
}
