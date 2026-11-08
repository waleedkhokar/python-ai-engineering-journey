import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, CalendarDays, Download, ExternalLink, FileText, FlaskConical, Link2, Plus, Search, Trash2, User, Building2 } from 'lucide-react';
import { api, json, toast } from '../lib/api';
import type { ResearchProject, ResearchSource } from '../types';
import { EmptyState, Field, Modal, Spinner } from '../components/UI';
import { relativeTime } from '../lib/utils';

export default function Research() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [project, setProject] = useState<ResearchProject | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'project' | 'source' | 'delete' | null>(null);

  const loadProjects = async () => {
    try {
      const result = await api<{ projects: ResearchProject[] }>('/api/research/projects');
      setProjects(result.projects);
      if (!selectedId && result.projects.length) setSelectedId(result.projects[0].id);
    } catch (error: any) { toast(error.message, 'error'); }
    finally { setLoading(false); }
  };
  const loadProject = async (id: string) => {
    try { const result = await api<{ project: ResearchProject }>(`/api/research/projects/${id}`); setProject(result.project); }
    catch (error: any) { toast(error.message, 'error'); }
  };
  useEffect(() => { loadProjects(); }, []);
  useEffect(() => { if (selectedId) loadProject(selectedId); else setProject(null); }, [selectedId]);
  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setSearchParams({}, { replace: true });
      setModal('project');
    }
  }, [searchParams]);

  const filtered = useMemo(() => projects.filter(item => `${item.title} ${item.description}`.toLowerCase().includes(query.toLowerCase())), [projects, query]);
  const removeSource = async (id: string) => {
    try { await api(`/api/research/sources/${id}`, { method: 'DELETE' }); toast('Source removed', 'success'); loadProject(selectedId!); loadProjects(); }
    catch (error: any) { toast(error.message, 'error'); }
  };

  return <div className="research-layout">
    <aside className="research-sidebar">
      <div className="conversation-list-header"><div><h2>Research projects</h2><span>{projects.length}</span></div><button className="icon-button accent" onClick={() => setModal('project')}><Plus size={19} /></button></div>
      <div className="search-box"><Search size={16} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search research…" /></div>
      <div className="project-list">{loading && <div className="center-loading"><Spinner /></div>}{!loading && filtered.length === 0 && <p className="muted empty-list-copy">No research projects found.</p>}{filtered.map(item => <button key={item.id} className={`project-list-item ${selectedId === item.id ? 'active' : ''}`} onClick={() => setSelectedId(item.id)}><span><FlaskConical size={17} /></span><div><strong>{item.title}</strong><p>{item.sourceCount || 0} sources · {relativeTime(item.updatedAt)}</p></div></button>)}</div>
      <button className="button secondary full-width" onClick={() => setModal('project')}><Plus size={16} />New research project</button>
    </aside>
    <section className="research-main">
      {!selectedId ? <EmptyState icon={<FlaskConical size={28} />} title="Give your findings a home" description="Create a project to collect source URLs, provenance, and your own notes. Nothing is treated as verified just because AI mentions it." action={<button className="button primary" onClick={() => setModal('project')}><Plus size={16} />Create research project</button>} /> : !project ? <div className="center-loading page-padding"><Spinner /></div> : <>
        <header className="research-project-header"><div><span className="eyebrow">RESEARCH PROJECT</span><h2>{project.title}</h2><p>{project.description || 'No project description yet.'}</p></div><div className="action-group"><a className="button secondary compact" href={`/api/research/projects/${project.id}/export`} download><Download size={15} />Export</a><button className="icon-button danger-hover" onClick={() => setModal('delete')}><Trash2 size={17} /></button><button className="button primary compact" onClick={() => setModal('source')}><Plus size={15} />Add source</button></div></header>
        <div className="provenance-banner"><BookOpen size={17} /><div><strong>Honest provenance</strong><p>Source metadata here is user-supplied unless you independently verify it. RaoSynapse does not invent citations or claim live web retrieval.</p></div></div>
        <div className="source-section-heading"><h3>Sources & notes <span>{project.sources?.length || 0}</span></h3><p>Keep evidence and interpretation connected.</p></div>
        {!project.sources?.length ? <EmptyState icon={<Link2 size={25} />} title="No sources saved yet" description="Add a URL, title, and your notes. Empty metadata stays empty—never fabricated." action={<button className="button secondary" onClick={() => setModal('source')}><Plus size={16} />Add your first source</button>} /> : <div className="source-grid">{project.sources.map(source => <SourceCard key={source.id} source={source} onDelete={() => removeSource(source.id)} />)}</div>}
      </>}
    </section>
    {modal === 'project' && <ProjectModal onClose={() => setModal(null)} onCreated={async (newProject: ResearchProject) => { setModal(null); await loadProjects(); setSelectedId(newProject.id); }} />}
    {modal === 'source' && project && <SourceModal project={project} onClose={() => setModal(null)} onCreated={() => { setModal(null); loadProject(project.id); loadProjects(); }} />}
    {modal === 'delete' && project && <Modal title="Delete research project?" description="All sources and notes inside this project will be permanently removed." onClose={() => setModal(null)}><div className="delete-summary"><Trash2 size={20} /><span><strong>{project.title}</strong><small>{project.sources?.length || 0} sources will be deleted.</small></span></div><div className="modal-actions"><button className="button secondary" onClick={() => setModal(null)}>Cancel</button><button className="button danger" onClick={async () => { await api(`/api/research/projects/${project.id}`, { method: 'DELETE' }); setProject(null); setSelectedId(null); setModal(null); await loadProjects(); toast('Research project deleted', 'success'); }}>Delete project</button></div></Modal>}
  </div>;
}

function SourceCard({ source, onDelete }: { source: ResearchSource; onDelete: () => void }) {
  return <article className="source-card"><div className="source-card-top"><span className="source-icon"><FileText size={19} /></span><div className="source-badges"><span>User supplied</span><span>Source</span></div><button className="icon-button danger-hover" onClick={onDelete} aria-label={`Delete ${source.title}`}><Trash2 size={15} /></button></div><h3>{source.title}</h3><a className="source-url" href={source.url} target="_blank" rel="noreferrer noopener">{source.url}<ExternalLink size={13} /></a><div className="source-metadata">{source.author && <span><User size={13} />{source.author}</span>}{source.publisher && <span><Building2 size={13} />{source.publisher}</span>}<span><CalendarDays size={13} />Accessed {source.accessedAt}</span></div>{source.publicationDate && <p className="publication-date">Published: {source.publicationDate}</p>}<p className="source-notes">{source.notes || 'No annotations added.'}</p><footer><span>Saved {relativeTime(source.createdAt)}</span><a href={source.url} target="_blank" rel="noreferrer noopener">Open source<ExternalLink size={12} /></a></footer></article>;
}

function ProjectModal({ onClose, onCreated }: any) {
  const [title, setTitle] = useState(''); const [description, setDescription] = useState(''); const [busy, setBusy] = useState(false);
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setBusy(true); try { const result = await api<{ project: ResearchProject }>('/api/research/projects', { method: 'POST', body: json({ title, description }) }); onCreated(result.project); } catch (error: any) { toast(error.message, 'error'); setBusy(false); } };
  return <Modal title="Create a research project" description="Organize sources and notes without overstating verification." onClose={onClose}><form className="form-stack" onSubmit={submit}><Field label="Project title"><input autoFocus required maxLength={120} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Urban heat adaptation" /></Field><Field label="Description"><textarea rows={3} maxLength={1000} value={description} onChange={e => setDescription(e.target.value)} placeholder="What are you investigating?" /></Field><div className="modal-actions"><button type="button" className="button secondary" onClick={onClose}>Cancel</button><button className="button primary" disabled={!title.trim() || busy}>{busy ? <Spinner /> : <Plus size={16} />}Create project</button></div></form></Modal>;
}

function SourceModal({ project, onClose, onCreated }: any) {
  const [form, setForm] = useState({ url: '', title: '', author: '', publisher: '', publicationDate: '', notes: '' });
  const [busy, setBusy] = useState(false);
  const update = (key: string, value: string) => setForm(current => ({ ...current, [key]: value }));
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setBusy(true); try { await api(`/api/research/projects/${project.id}/sources`, { method: 'POST', body: json(form) }); toast('Source saved with user-supplied provenance', 'success'); onCreated(); } catch (error: any) { toast(error.message, 'error'); setBusy(false); } };
  return <Modal title="Add a source" description="Only enter metadata you know. Leave unknown fields blank rather than guessing." onClose={onClose} wide><form className="form-stack" onSubmit={submit}><div className="form-grid"><Field label="Source URL"><input required type="url" value={form.url} onChange={e => update('url', e.target.value)} placeholder="https://example.org/article" /></Field><Field label="Title"><input required value={form.title} onChange={e => update('title', e.target.value)} placeholder="Source or paper title" /></Field><Field label="Author (optional)"><input value={form.author} onChange={e => update('author', e.target.value)} /></Field><Field label="Publisher (optional)"><input value={form.publisher} onChange={e => update('publisher', e.target.value)} /></Field></div><Field label="Publication date (optional)"><input value={form.publicationDate} onChange={e => update('publicationDate', e.target.value)} placeholder="e.g. 2025-04-18" /></Field><Field label="Your notes"><textarea rows={4} value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="What does this source contribute? What still needs verification?" /></Field><div className="modal-actions"><button type="button" className="button secondary" onClick={onClose}>Cancel</button><button className="button primary" disabled={!form.url || !form.title || busy}>{busy ? <Spinner /> : <Plus size={16} />}Save source</button></div></form></Modal>;
}
