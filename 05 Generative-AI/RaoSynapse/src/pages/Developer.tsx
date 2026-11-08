import { useEffect, useState } from 'react';
import { Check, CheckCircle2, Code2, Copy, KeyRound, Plus, RefreshCw, ShieldCheck, Terminal, Trash2, XCircle } from 'lucide-react';
import { api, copyText, json, toast } from '../lib/api';
import { Field, Modal, Spinner } from '../components/UI';
import { relativeTime } from '../lib/utils';

type Token = { id: string; name: string; prefix: string; scopes: string[]; createdAt: string; lastUsedAt?: string; revokedAt?: string };

export default function Developer() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [health, setHealth] = useState<any>(null);
  const [modal, setModal] = useState(false);
  const [secret, setSecret] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    try {
      const [tokenResult, healthResult] = await Promise.all([api<{ tokens: Token[] }>('/api/developer/tokens'), api<any>('/api/v1/health')]);
      setTokens(tokenResult.tokens); setHealth(healthResult);
    } catch (error: any) { toast(error.message, 'error'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const revoke = async (token: Token) => {
    try { await api(`/api/developer/tokens/${token.id}`, { method: 'DELETE' }); toast('API token revoked', 'success'); load(); }
    catch (error: any) { toast(error.message, 'error'); }
  };
  const origin = location.origin;
  const example = `curl ${origin}/api/v1/conversations \\\n  -H "Authorization: Bearer rs_your_token" \\\n  -H "Content-Type: application/json"`;
  return <div className="developer-page">
    <section className="developer-hero"><div><span className="eyebrow"><Code2 size={14} />SYNAPSE DEVELOPER PLATFORM</span><h2>Build on your connected intelligence.</h2><p>Create scoped, revocable credentials for authorized messaging and AI workflows. Secrets are hashed and shown only once.</p></div><button className="button primary" onClick={() => setModal(true)}><Plus size={17} />Create API token</button></section>
    <div className="developer-grid">
      <section className="dashboard-section token-section"><div className="section-heading"><div><h3>API credentials</h3><p>Only grant the access each integration needs</p></div><button className="icon-button" onClick={load}><RefreshCw size={16} /></button></div>{loading ? <div className="center-loading"><Spinner /></div> : tokens.length === 0 ? <div className="developer-empty"><span><KeyRound size={25} /></span><h3>No API tokens yet</h3><p>Create your first scoped credential to test the live API.</p><button className="button secondary" onClick={() => setModal(true)}>Create token</button></div> : <div className="token-table-wrap"><table className="token-table"><thead><tr><th>Name</th><th>Token</th><th>Scopes</th><th>Last used</th><th>Status</th><th /></tr></thead><tbody>{tokens.map(token => <tr key={token.id} className={token.revokedAt ? 'revoked' : ''}><td><strong>{token.name}</strong><small>Created {relativeTime(token.createdAt)}</small></td><td><code>{token.prefix}••••••••</code></td><td><div className="scope-list">{token.scopes.map(scope => <span key={scope}>{scope}</span>)}</div></td><td>{token.lastUsedAt ? relativeTime(token.lastUsedAt) : 'Never'}</td><td>{token.revokedAt ? <span className="token-status revoked"><XCircle size={13} />Revoked</span> : <span className="token-status active"><CheckCircle2 size={13} />Active</span>}</td><td>{!token.revokedAt && <button className="icon-button danger-hover" onClick={() => revoke(token)} title="Revoke token"><Trash2 size={16} /></button>}</td></tr>)}</tbody></table></div>}</section>
      <aside className="developer-side"><section className="dashboard-section api-health"><div className="section-heading"><div><h3>API health</h3><p>Live service check</p></div><span className={`health-dot ${health?.status === 'ok' ? 'ok' : ''}`} /></div><div className="health-endpoint"><span>GET</span><code>/api/v1/health</code></div><div className="health-result"><span>Status</span><strong>{health?.status || 'Checking…'}</strong></div><div className="health-result"><span>Service</span><strong>{health?.service || 'raosynapse'}</strong></div></section><section className="dashboard-section security-tip"><ShieldCheck size={22} /><div><h3>Keep secrets server-side</h3><p>Never embed API tokens in browser code, mobile bundles, or public repositories.</p></div></section></aside>
    </div>
    <section className="dashboard-section api-reference"><div className="section-heading"><div><h3>Live API reference</h3><p>Versioned endpoints backed by your authorized data</p></div><span className="version-badge">v1</span></div><div className="endpoint-list"><Endpoint method="GET" path="/api/v1/conversations" description="List conversations available to your token" scope="messages:read" /><Endpoint method="GET" path="/api/v1/conversations/{id}/messages" description="Read ordered message history" scope="messages:read" /><Endpoint method="POST" path="/api/v1/messages" description="Persist and send a room or direct message" scope="messages:send" /><Endpoint method="GET" path="/api/v1/messages/{id}" description="Retrieve an authorized message and its state" scope="messages:read" /><Endpoint method="POST" path="/api/v1/ai/chat" description="Submit an AI request in an owned AI conversation" scope="ai:use" /></div><div className="code-sample"><div className="code-header"><span><Terminal size={15} />Quick start</span><button onClick={() => copyText(example, 'cURL example copied')}><Copy size={14} />Copy</button></div><pre><code>{example}</code></pre></div><div className="idempotency-note"><strong>Safe message retries</strong><p>Message creation requires an <code>idempotencyKey</code>. Reusing the same key and content returns the accepted message instead of creating a duplicate.</p></div></section>
    {modal && <TokenModal onClose={() => setModal(false)} onCreated={(created: any) => { setModal(false); setSecret(created); load(); }} />}
    {secret && <Modal title="Copy your API token now" description="For security, this complete secret will not be shown again." onClose={() => setSecret(null)}><div className="secret-warning"><KeyRound size={21} /><p>Store it in a server-side secret manager. Anyone with this token can perform its granted scopes until you revoke it.</p></div><div className="secret-box"><code>{secret.secret}</code><button className="button secondary" onClick={() => copyText(secret.secret, 'API token copied')}><Copy size={16} />Copy token</button></div><div className="scope-list secret-scopes">{secret.scopes.map((scope: string) => <span key={scope}><Check size={12} />{scope}</span>)}</div><div className="modal-actions"><button className="button primary" onClick={() => setSecret(null)}>I have saved this token</button></div></Modal>}
  </div>;
}

function Endpoint({ method, path, description, scope }: any) {
  return <div className="endpoint-row"><span className={`http-method ${method.toLowerCase()}`}>{method}</span><div><code>{path}</code><p>{description}</p></div><span className="scope-badge">{scope}</span></div>;
}

function TokenModal({ onClose, onCreated }: any) {
  const [name, setName] = useState('My integration');
  const [scopes, setScopes] = useState<string[]>(['messages:read']);
  const [busy, setBusy] = useState(false);
  const toggle = (scope: string) => setScopes(current => current.includes(scope) ? current.filter(item => item !== scope) : [...current, scope]);
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setBusy(true); try { const result = await api<{ token: any }>('/api/developer/tokens', { method: 'POST', body: json({ name, scopes }) }); onCreated(result.token); } catch (error: any) { toast(error.message, 'error'); setBusy(false); } };
  return <Modal title="Create a scoped API token" description="You can revoke access independently for each integration." onClose={onClose}><form className="form-stack" onSubmit={submit}><Field label="Token name"><input autoFocus value={name} onChange={e => setName(e.target.value)} maxLength={80} required /></Field><div className="scope-picker"><span>Permissions</span>{[['messages:read', 'Read conversations and messages'], ['messages:send', 'Send authorized direct or room messages'], ['ai:use', 'Request AI responses in owned AI conversations']].map(([scope, description]) => <label key={scope} className={scopes.includes(scope) ? 'selected' : ''}><input type="checkbox" checked={scopes.includes(scope)} onChange={() => toggle(scope)} /><span><strong>{scope}</strong><small>{description}</small></span><i>{scopes.includes(scope) && <Check size={13} />}</i></label>)}</div><div className="modal-actions"><button type="button" className="button secondary" onClick={onClose}>Cancel</button><button className="button primary" disabled={!name.trim() || !scopes.length || busy}>{busy ? <Spinner /> : <KeyRound size={16} />}Generate token</button></div></form></Modal>;
}
