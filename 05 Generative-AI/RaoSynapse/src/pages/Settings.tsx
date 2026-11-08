import { useState } from 'react';
import { Bot, Check, Database, Eye, EyeOff, KeyRound, LockKeyhole, LogOut, Save, ShieldCheck, Trash2, UserRound } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { api, json, toast } from '../lib/api';
import { Avatar, Field, Modal, Spinner, Toggle } from '../components/UI';

export default function Settings() {
  const { user, setUser, ai, logout } = useAuth();
  const [displayName, setDisplayName] = useState(user!.displayName);
  const [bio, setBio] = useState(user!.bio);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirm, setConfirm] = useState('');

  const save = async (event?: React.FormEvent) => {
    event?.preventDefault(); setSaving(true);
    try { const result = await api<{ user: any }>('/api/users/me', { method: 'PATCH', body: json({ displayName, bio }) }); setUser(result.user); toast('Profile saved', 'success'); }
    catch (error: any) { toast(error.message, 'error'); }
    finally { setSaving(false); }
  };
  const privacy = async (changes: any) => {
    try { const result = await api<{ user: any }>('/api/users/me', { method: 'PATCH', body: json(changes) }); setUser(result.user); toast('Privacy setting updated', 'success'); }
    catch (error: any) { toast(error.message, 'error'); }
  };
  const revokeOthers = async () => {
    try { const result = await api<{ revoked: number }>('/api/users/me/sessions/revoke-others', { method: 'POST' }); toast(`${result.revoked} other session${result.revoked === 1 ? '' : 's'} revoked`, 'success'); }
    catch (error: any) { toast(error.message, 'error'); }
  };
  const removeAccount = async () => {
    try { await api('/api/users/me', { method: 'DELETE' }); setUser(null); window.location.replace('/'); }
    catch (error: any) { toast(error.message, 'error'); }
  };

  return <div className="settings-page">
    <section className="settings-card profile-settings"><div className="settings-heading"><span><UserRound size={19} /></span><div><h2>Profile</h2><p>How other RaoSynapse members see you</p></div></div><div className="profile-editor"><div className="profile-avatar-editor"><Avatar name={displayName} color={user!.avatarColor} size="lg" /><div><strong>{user!.username}</strong><p>Member since {new Date(user!.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p></div></div><form className="form-stack" onSubmit={save}><div className="form-grid"><Field label="Display name"><input value={displayName} onChange={e => setDisplayName(e.target.value)} maxLength={60} required /></Field><Field label="Username" hint="Usernames cannot be changed in this release."><input value={user!.username} disabled /></Field></div><Field label="Bio" hint={`${bio.length}/280 characters`}><textarea rows={3} value={bio} onChange={e => setBio(e.target.value)} maxLength={280} placeholder="What are you interested in?" /></Field><div><button className="button primary" disabled={saving || !displayName.trim()}>{saving ? <Spinner /> : <Save size={16} />}Save profile</button></div></form></div></section>

    <section className="settings-card"><div className="settings-heading"><span><Eye size={19} /></span><div><h2>Privacy & discovery</h2><p>Control how members can find and interact with you</p></div></div><div className="toggle-list"><Toggle checked={user!.discoverable} onChange={checked => privacy({ discoverable: checked })} label="Allow username discovery" description="Let members find your approved public profile when searching for collaborators." /><Toggle checked={user!.messagePrivacy === 'everyone'} onChange={checked => privacy({ messagePrivacy: checked ? 'everyone' : 'nobody' })} label="Allow new private messages" description="When off, other members cannot start a new direct conversation with you." /><Toggle checked={user!.showPresence} onChange={checked => privacy({ showPresence: checked })} label="Share online presence" description="Show your online status to members with whom you share conversations." /></div></section>

    <section className="settings-card"><div className="settings-heading"><span><ShieldCheck size={19} /></span><div><h2>Security & sessions</h2><p>Your account and active access</p></div></div><div className="settings-rows"><div className="settings-row"><span className="settings-row-icon"><LockKeyhole size={18} /></span><div><strong>Username-only preview identity</strong><p>Your unique username opens this workspace. Sessions use secure token hashes; do not use sensitive information.</p></div><span className="status-label"><Check size={14} />Preview access</span></div><div className="settings-row"><span className="settings-row-icon"><KeyRound size={18} /></span><div><strong>Other devices</strong><p>Revoke every active session except the one you are using now.</p></div><button className="button secondary compact" onClick={revokeOthers}>Revoke others</button></div><div className="settings-row"><span className="settings-row-icon"><LogOut size={18} /></span><div><strong>Current session</strong><p>Sign out on this device.</p></div><button className="button secondary compact" onClick={async () => { await logout(); window.location.replace('/'); }}>Sign out</button></div></div></section>

    <section className="settings-card"><div className="settings-heading"><span><Database size={19} /></span><div><h2>Data & AI</h2><p>Understand how your workspace operates</p></div></div><div className="settings-rows"><div className="settings-row"><span className="settings-row-icon"><Bot size={18} /></span><div><strong>AI inference</strong><p>{ai?.configured ? `Connected to Groq using ${ai.model}. Prompts are processed server-side.` : 'Preview responder is active. Add a server-side GROQ_API_KEY to enable Groq inference.'}</p></div><span className={`status-label ${!ai?.configured ? 'warning' : ''}`}>{ai?.configured ? 'Groq' : 'Preview'}</span></div><div className="settings-row"><span className="settings-row-icon"><Database size={18} /></span><div><strong>Persistent workspace</strong><p>Messages, conversations, rooms, research, and settings are stored in the application database.</p></div><span className="status-label"><Check size={14} />Active</span></div></div><div className="notice privacy-note"><EyeOff size={17} /><p>Private means access-controlled, not end-to-end encrypted. Share snapshots carefully: copied or forked content cannot be recalled.</p></div></section>

    <section className="settings-card danger-zone"><div className="settings-heading"><span><Trash2 size={19} /></span><div><h2>Delete account</h2><p>Permanently remove your account and owned workspace data</p></div></div><div className="danger-zone-row"><p>Owned conversations and research will be deleted. Your contributions in other members’ rooms may remain with “Deleted user” attribution. Existing forks and snapshots are independent copies.</p><button className="button danger" onClick={() => setDeleteOpen(true)}>Delete account</button></div></section>

    {deleteOpen && <Modal title="Permanently delete your account?" description="This action signs you out and cannot be undone." onClose={() => setDeleteOpen(false)}><div className="delete-summary"><Trash2 size={20} /><span><strong>@{user!.username}</strong><small>Owned conversations, rooms, research, sessions, and API tokens will be removed.</small></span></div><Field label={`Type ${user!.username} to confirm`}><input autoFocus value={confirm} onChange={e => setConfirm(e.target.value)} placeholder={user!.username} /></Field><div className="modal-actions"><button className="button secondary" onClick={() => setDeleteOpen(false)}>Cancel</button><button className="button danger" disabled={confirm !== user!.username} onClick={removeAccount}>Delete my account</button></div></Modal>}
  </div>;
}
