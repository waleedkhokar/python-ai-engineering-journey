import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Bot, Check, Copy, GitFork, Link2, LockKeyhole, MessageCircle, MoreHorizontal, Pencil, Plus, Search, Share2, Shield, Trash2, UserPlus, UsersRound, X } from 'lucide-react';
import ConversationList from './ConversationList';
import ChatPanel from './ChatPanel';
import { Avatar, EmptyState, Field, Modal, Spinner } from './UI';
import { api, clientId, copyText, json, toast } from '../lib/api';
import { useAuth } from '../lib/auth';
import { useRealtime } from '../lib/realtime';
import type { Conversation, Invitation, User } from '../types';
import { cx, relativeTime, truncate } from '../lib/utils';
import { clearChatDraft, peekChatDraft } from '../lib/draft';

export default function ConversationWorkspace({ kind }: { kind: 'ai' | 'direct' | 'room' }) {
  const params = useParams();
  const selectedId = params.id;
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { addListener } = useRealtime();
  const creatingAI = useRef(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState<'new' | 'share' | 'rename' | 'delete' | 'invite' | 'members' | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const base = kind === 'ai' ? '/app/ai' : kind === 'direct' ? '/app/messages' : '/app/rooms';

  const refresh = useCallback(async () => {
    try {
      const result = await api<{ conversations: Conversation[] }>(`/api/conversations?type=${kind}`);
      setConversations(result.conversations);
      if (kind === 'room') {
        const invites = await api<{ invitations: Invitation[] }>('/api/invitations');
        setInvitations(invites.invitations);
      }
    } catch (error: any) { toast(error.message, 'error'); }
    finally { setLoading(false); }
  }, [kind]);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => addListener(event => {
    if (kind === 'direct' && event.type === 'presence') { refresh(); return; }
    const globalRefresh = ['conversation_added', 'invitation_created', 'member_added', 'member_removed'].includes(event.type);
    const inactiveConversationUpdate = event.conversationId && event.conversationId !== selectedId && ['message_created', 'conversation_updated', 'conversation_deleted'].includes(event.type);
    if (globalRefresh || inactiveConversationUpdate) refresh();
  }), [addListener, refresh, selectedId, kind]);

  const createAI = useCallback(async (draftPrompt = '') => {
    if (creatingAI.current) return;
    creatingAI.current = true;
    try {
      const result = await api<{ conversation: Conversation }>('/api/conversations', { method: 'POST', body: json({ type: 'ai' }) });
      await refresh();
      if (draftPrompt) clearChatDraft();
      navigate(`${base}/${result.conversation.id}`, { replace: true, state: draftPrompt ? { draftPrompt, autoStart: true } : null });
    } finally { creatingAI.current = false; }
  }, [base, refresh, navigate]);

  useEffect(() => {
    if (searchParams.get('new') !== '1') return;
    if (kind === 'ai') {
      const draftPrompt = searchParams.get('draft') === '1' ? peekChatDraft() : '';
      setSearchParams({}, { replace: true });
      createAI(draftPrompt).catch(error => toast(error.message, 'error'));
    } else {
      setSearchParams({}, { replace: true });
      setModal('new');
    }
  }, [kind, searchParams]);

  const filtered = useMemo(() => conversations.filter(conversation => {
    const text = `${conversation.title} ${conversation.lastMessage?.content || ''}`.toLowerCase();
    return text.includes(query.toLowerCase());
  }), [conversations, query]);
  const selected = conversations.find(conversation => conversation.id === selectedId);

  const onNew = () => kind === 'ai' ? createAI().catch(error => toast(error.message, 'error')) : setModal('new');
  const onDeleted = () => { setModal(null); refresh(); navigate(base); };

  const fork = async () => {
    if (!selectedId) return;
    try {
      const result = await api<{ conversation: Conversation }>(`/api/conversations/${selectedId}/fork`, { method: 'POST', body: json({}) });
      toast('Independent fork created', 'success');
      navigate(`/app/ai/${result.conversation.id}`);
    } catch (error: any) { toast(error.message, 'error'); }
  };

  return <div className={cx('workspace-layout', selectedId && 'conversation-open')}>
    <div className="workspace-list-column">
      <ConversationList conversations={filtered} activeId={selectedId} onSelect={id => navigate(`${base}/${id}`)} onNew={onNew} query={query} setQuery={setQuery} kind={kind} loading={loading} />
      {kind === 'room' && invitations.length > 0 && <div className="invite-strip"><UserPlus size={16} /><span><strong>{invitations.length} room invitation{invitations.length > 1 ? 's' : ''}</strong><small>Review below to join</small></span><button onClick={() => navigate(base)}>View</button></div>}
    </div>
    <div className="workspace-chat-column">
      {selectedId ? <ChatPanel key={selectedId} conversationId={selectedId} mode={kind} initialDraft={(location.state as any)?.draftPrompt || ''} autoStart={!!(location.state as any)?.autoStart} onDraftConsumed={() => navigate(location.pathname, { replace: true, state: null })} onChanged={refresh} onDeleted={onDeleted} onBack={() => navigate(base)} actions={selected && <div className="action-group">
        {(kind === 'ai' || (kind === 'room' && ['owner', 'editor'].includes(selected.role))) && <>
          <button className="button compact secondary hide-small" onClick={fork}><GitFork size={15} />Fork</button>
          <button className="button compact secondary" onClick={() => setModal('share')}><Share2 size={15} /><span className="hide-small">Share</span></button>
        </>}
        {kind === 'room' && selected.role === 'owner' && <>
          <button className="button compact secondary" onClick={() => setModal('invite')}><UserPlus size={15} /><span className="hide-small">Invite</span></button>
          <button className="icon-button" onClick={() => setModal('members')} title="Room members"><UsersRound size={18} /></button>
        </>}
        {(kind === 'ai' || (kind === 'room' && selected.role === 'owner')) && <div className="dropdown-wrap">
          <button className="icon-button" onClick={() => setModal('rename')} title="Rename"><Pencil size={17} /></button>
          <button className="icon-button danger-hover" onClick={() => setModal('delete')} title="Delete"><Trash2 size={17} /></button>
        </div>}
      </div>} /> : <WorkspaceWelcome kind={kind} onNew={onNew} invitations={invitations} refresh={refresh} navigate={navigate} />}
    </div>

    {modal === 'new' && kind === 'room' && <NewRoomModal onClose={() => setModal(null)} onCreated={(conversation: Conversation) => { refresh(); setModal(null); navigate(`${base}/${conversation.id}`); }} />}
    {modal === 'new' && kind === 'direct' && <NewMessageModal onClose={() => setModal(null)} onCreated={(conversation: Conversation) => { refresh(); setModal(null); navigate(`${base}/${conversation.id}`); }} />}
    {modal === 'share' && selected && <ShareModal conversation={selected} onClose={() => setModal(null)} />}
    {modal === 'rename' && selected && <RenameModal conversation={selected} onClose={() => setModal(null)} onSaved={() => { setModal(null); refresh(); }} />}
    {modal === 'delete' && selected && <DeleteModal conversation={selected} onClose={() => setModal(null)} onDeleted={onDeleted} />}
    {modal === 'invite' && selected && <InviteModal room={selected} onClose={() => setModal(null)} />}
    {modal === 'members' && selected && <MembersModal room={selected} currentUser={user!} onClose={() => setModal(null)} onChanged={refresh} />}
  </div>;
}

function WorkspaceWelcome({ kind, onNew, invitations, refresh, navigate }: any) {
  const content = ({
    ai: { icon: <Bot size={28} />, eyebrow: 'PRIVATE INTELLIGENCE', title: 'Turn a question into a useful thread.', description: 'Investigate with AI, keep your context, then share a snapshot or fork the work when you are ready.', action: 'Start an AI conversation' },
    direct: { icon: <Shield size={28} />, eyebrow: 'PRIVATE MESSAGING', title: 'Your conversations, connected.', description: 'Find a member and start a persistent, realtime private conversation with honest delivery states.', action: 'Find someone to message' },
    room: { icon: <UsersRound size={28} />, eyebrow: 'COLLABORATIVE INTELLIGENCE', title: 'Think together, with shared context.', description: 'Invite collaborators, exchange messages, and ask AI to work from the same room timeline.', action: 'Create a room' },
  } as any)[kind];
  return <div className="workspace-welcome">
    <div className="welcome-grid" />
    <div className="welcome-content"><span className="welcome-icon">{content.icon}</span><span className="eyebrow">{content.eyebrow}</span><h2>{content.title}</h2><p>{content.description}</p><button className="button primary" onClick={onNew}><Plus size={17} />{content.action}</button></div>
    {kind === 'ai' && <div className="journey-steps">{['Ask privately', 'Save the useful parts', 'Share or collaborate', 'Fork and continue'].map((step, index) => <div key={step}><span>0{index + 1}</span><strong>{step}</strong></div>)}</div>}
    {kind === 'direct' && <div className="direct-welcome-features"><div><LockKeyhole size={17} /><span><strong>Private by design</strong><small>Only the two members can read the timeline.</small></span></div><div><Check size={17} /><span><strong>Delivery & read states</strong><small>Know when a message is sent, delivered, and read.</small></span></div><div><MessageCircle size={17} /><span><strong>Realtime with history</strong><small>Reconnect and keep the complete conversation.</small></span></div></div>}
    {kind === 'room' && invitations.length > 0 && <div className="pending-invites"><h3>Pending invitations</h3>{invitations.map((invite: Invitation) => <div className="invitation-card" key={invite.id}><span className="conversation-type-icon type-room"><UsersRound size={18} /></span><div><strong>{invite.roomTitle}</strong><p>Invited by {invite.inviterName} · {relativeTime(invite.createdAt)}</p></div><button className="button compact secondary" onClick={async () => { await api(`/api/invitations/${invite.id}/decline`, { method: 'POST' }); refresh(); }}>Decline</button><button className="button compact primary" onClick={async () => { const result = await api<{ conversation: Conversation }>(`/api/invitations/${invite.id}/accept`, { method: 'POST' }); await refresh(); navigate(`/app/rooms/${result.conversation.id}`); }}>Accept</button></div>)}</div>}
  </div>;
}

function NewRoomModal({ onClose, onCreated }: any) {
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true);
    try { const result = await api<{ conversation: Conversation }>('/api/conversations', { method: 'POST', body: json({ type: 'room', title }) }); onCreated(result.conversation); }
    catch (error: any) { toast(error.message, 'error'); setBusy(false); }
  };
  return <Modal title="Create a collaborative room" description="A shared timeline for people and AI. You can invite members after creation." onClose={onClose}><form onSubmit={submit} className="form-stack"><Field label="Room name"><input autoFocus value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Climate research group" maxLength={120} required /></Field><div className="modal-actions"><button type="button" className="button secondary" onClick={onClose}>Cancel</button><button className="button primary" disabled={!title.trim() || busy}>{busy ? <Spinner /> : <Plus size={16} />}Create room</button></div></form></Modal>;
}

function NewMessageModal({ onClose, onCreated }: any) {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<User | null>(null);
  const [openingMessage, setOpeningMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(false);
  const openingClientId = useRef(clientId());

  useEffect(() => {
    if (selected || query.trim().length < 2) { setUsers([]); return; }
    const timer = setTimeout(() => {
      setLoading(true);
      api<{ users: User[] }>(`/api/users/search?q=${encodeURIComponent(query)}`)
        .then(result => setUsers(result.users))
        .catch(error => toast(error.message, 'error'))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timer);
  }, [query, selected]);

  const start = async () => {
    if (!selected || starting) return;
    setStarting(true);
    try {
      const result = await api<{ conversation: Conversation }>('/api/conversations/direct', { method: 'POST', body: json({ userId: selected.id }) });
      if (openingMessage.trim()) {
        await api(`/api/conversations/${result.conversation.id}/messages`, { method: 'POST', body: json({ content: openingMessage.trim(), clientId: openingClientId.current }) });
      }
      onCreated(result.conversation);
    } catch (error: any) { toast(error.message, 'error'); }
    finally { setStarting(false); }
  };

  return <Modal title={selected ? `Message ${selected.displayName}` : 'Start a private conversation'} description={selected ? 'Review the contact and write an optional opening message.' : 'Search by username. Only approved public profile information is shown.'} onClose={onClose} wide>
    {!selected ? <div className="contact-picker">
      <div className="search-box modal-search"><Search size={17} /><input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="Search username…" aria-label="Search people by username" /></div>
      <div className="user-results">{loading && <div className="center-loading"><Spinner /></div>}{!loading && query.length >= 2 && users.length === 0 && <div className="contact-empty"><UsersRound size={22} /><strong>No discoverable members found</strong><p>Check the username or try a demo contact below.</p></div>}{users.map(person => <button className="user-result" key={person.id} onClick={() => setSelected(person)}><Avatar name={person.displayName} color={person.avatarColor} online={person.online} /><span><strong>{person.displayName}</strong><small>@{person.username} · {person.online ? 'Online now' : 'Offline'}</small></span><span className="user-result-action"><ArrowRight size={15} /></span></button>)}</div>
      <div className="contact-suggestions"><span>Preview contacts</span>{['sam', 'alex'].map(name => <button key={name} onClick={() => setQuery(name)}>@{name}</button>)}</div>
    </div> : <div className="contact-compose">
      <button className="contact-back" onClick={() => setSelected(null)}><ArrowLeft size={14} />Choose a different person</button>
      <div className="contact-profile-card"><Avatar name={selected.displayName} color={selected.avatarColor} size="lg" online={selected.online} /><div><span className="contact-presence">{selected.online ? 'Online now' : 'Offline'}</span><h3>{selected.displayName}</h3><p>@{selected.username}</p><small>{selected.bio || 'RaoSynapse member'}</small></div><Shield size={19} /></div>
      <Field label="Opening message (optional)" hint={`${openingMessage.length}/8,000 characters`}><textarea autoFocus rows={4} maxLength={8000} value={openingMessage} onChange={event => setOpeningMessage(event.target.value)} placeholder={`Write a private message to ${selected.displayName}…`} /></Field>
      <div className="contact-privacy-note"><LockKeyhole size={15} /><span>Private between the two of you. Messages are saved before they appear as sent.</span></div>
      <div className="modal-actions"><button className="button secondary" onClick={onClose}>Cancel</button><button className="button primary" onClick={start} disabled={starting}>{starting ? <Spinner /> : <MessageCircle size={16} />}{openingMessage.trim() ? 'Send & open conversation' : 'Open conversation'}</button></div>
    </div>}
  </Modal>;
}

function ShareModal({ conversation, onClose }: { conversation: Conversation; onClose: () => void }) {
  const [permission, setPermission] = useState<'view' | 'fork'>('view');
  const [share, setShare] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const create = async () => {
    setBusy(true);
    try { const result = await api<{ share: any }>(`/api/conversations/${conversation.id}/snapshots`, { method: 'POST', body: json({ permission }) }); setShare(result.share); }
    catch (error: any) { toast(error.message, 'error'); }
    finally { setBusy(false); }
  };
  const url = share ? `${location.origin}${share.url}` : '';
  return <Modal title="Share an immutable snapshot" description="Sharing creates a point-in-time copy. Future private messages are never included." onClose={onClose}>
    {!share ? <div className="form-stack"><div className="share-preview"><span className="conversation-type-icon type-ai"><Link2 size={18} /></span><div><strong>{conversation.title}</strong><p>{conversation.messages?.length || 'Current'} visible messages and content up to this moment</p></div></div><div className="choice-cards"><button className={cx('choice-card', permission === 'view' && 'selected')} onClick={() => setPermission('view')}><span><strong>View only</strong><small>Recipients can read this snapshot but cannot change or fork it.</small></span><i>{permission === 'view' && <Check size={14} />}</i></button><button className={cx('choice-card', permission === 'fork' && 'selected')} onClick={() => setPermission('fork')}><span><strong>View + fork</strong><small>Recipients can also create an independent copy in their own workspace.</small></span><i>{permission === 'fork' && <Check size={14} />}</i></button></div><div className="notice"><Shield size={17} /><p>Recipients must enter a username. Anyone with the active link can access it until you revoke it. Existing forks cannot be recalled.</p></div><div className="modal-actions"><button className="button secondary" onClick={onClose}>Cancel</button><button className="button primary" onClick={create} disabled={busy}>{busy ? <Spinner /> : <Share2 size={16} />}Create secure link</button></div></div> : <div className="form-stack"><div className="success-panel"><span><Check size={22} /></span><h3>Your snapshot is ready</h3><p>{share.permission === 'fork' ? 'View and fork' : 'View-only'} access · future conversation changes are excluded.</p></div><Field label="Share link" hint="This link grants access to the snapshot. Share it only with intended recipients."><div className="copy-input"><input readOnly value={url} /><button className="button secondary" onClick={() => copyText(url, 'Share link copied')}><Copy size={16} />Copy</button></div></Field><div className="modal-actions"><button className="button secondary" onClick={() => setShare(null)}>Create another</button><button className="button primary" onClick={onClose}>Done</button></div></div>}
  </Modal>;
}

function RenameModal({ conversation, onClose, onSaved }: any) {
  const [title, setTitle] = useState(conversation.title);
  const save = async (event: React.FormEvent) => { event.preventDefault(); try { await api(`/api/conversations/${conversation.id}`, { method: 'PATCH', body: json({ title }) }); toast('Conversation renamed', 'success'); onSaved(); } catch (error: any) { toast(error.message, 'error'); } };
  return <Modal title="Rename conversation" onClose={onClose}><form className="form-stack" onSubmit={save}><Field label="Title"><input autoFocus value={title} onChange={e => setTitle(e.target.value)} maxLength={120} required /></Field><div className="modal-actions"><button type="button" className="button secondary" onClick={onClose}>Cancel</button><button className="button primary" disabled={!title.trim()}>Save changes</button></div></form></Modal>;
}

function DeleteModal({ conversation, onClose, onDeleted }: any) {
  const [busy, setBusy] = useState(false);
  const remove = async () => { setBusy(true); try { await api(`/api/conversations/${conversation.id}`, { method: 'DELETE' }); toast('Conversation deleted', 'success'); onDeleted(); } catch (error: any) { toast(error.message, 'error'); setBusy(false); } };
  return <Modal title="Delete this conversation?" description="This permanently removes its timeline for all members. Existing snapshots and forks are independent copies and are not deleted." onClose={onClose}><div className="delete-summary"><Trash2 size={20} /><span><strong>{conversation.title}</strong><small>This action cannot be undone.</small></span></div><div className="modal-actions"><button className="button secondary" onClick={onClose}>Keep conversation</button><button className="button danger" onClick={remove} disabled={busy}>{busy ? <Spinner /> : <Trash2 size={16} />}Delete permanently</button></div></Modal>;
}

function InviteModal({ room, onClose }: any) {
  const [username, setUsername] = useState('');
  const [busy, setBusy] = useState(false);
  const invite = async (event: React.FormEvent) => { event.preventDefault(); setBusy(true); try { await api(`/api/conversations/${room.id}/invitations`, { method: 'POST', body: json({ username }) }); toast(`Invitation sent to @${username}`, 'success'); onClose(); } catch (error: any) { toast(error.message, 'error'); setBusy(false); } };
  return <Modal title={`Invite to ${room.title}`} description="The member becomes an editor after accepting your invitation." onClose={onClose}><form className="form-stack" onSubmit={invite}><Field label="Exact username" hint="Only the username is used for this invitation."><input autoFocus value={username} onChange={e => setUsername(e.target.value)} placeholder="e.g. sam" required /></Field><div className="modal-actions"><button type="button" className="button secondary" onClick={onClose}>Cancel</button><button className="button primary" disabled={!username.trim() || busy}>{busy ? <Spinner /> : <UserPlus size={16} />}Send invitation</button></div></form></Modal>;
}

function MembersModal({ room, currentUser, onClose, onChanged }: any) {
  const update = async (userId: string, role: string) => { try { await api(`/api/conversations/${room.id}/members/${userId}`, { method: 'PATCH', body: json({ role }) }); toast('Member role updated', 'success'); onChanged(); } catch (error: any) { toast(error.message, 'error'); } };
  const remove = async (userId: string) => { try { await api(`/api/conversations/${room.id}/members/${userId}`, { method: 'DELETE' }); toast('Member removed', 'success'); onChanged(); } catch (error: any) { toast(error.message, 'error'); } };
  return <Modal title="Room members" description="Roles are enforced by the backend for messages, AI requests, sharing, and management." onClose={onClose}><div className="member-list">{room.members.map((member: User) => <div className="member-row" key={member.id}><Avatar name={member.displayName} color={member.avatarColor} /><div><strong>{member.displayName}{member.id === currentUser.id && ' (you)'}</strong><small>@{member.username}</small></div>{room.role === 'owner' && member.role !== 'owner' ? <><select aria-label={`Role for ${member.displayName}`} value={member.role} onChange={e => update(member.id, e.target.value)}><option value="editor">Editor</option><option value="viewer">Viewer</option></select><button className="icon-button danger-hover" onClick={() => remove(member.id)}><X size={16} /></button></> : <span className="role-badge">{member.role}</span>}</div>)}</div><div className="modal-actions"><button className="button primary" onClick={onClose}>Done</button></div></Modal>;
}
