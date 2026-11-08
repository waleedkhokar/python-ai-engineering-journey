import { useEffect, type ReactNode } from 'react';
import { X, LoaderCircle, Sparkles } from 'lucide-react';
import { cx, initials } from '../lib/utils';

export function Logo({ compact = false }: { compact?: boolean }) {
  return <div className={cx('brand', compact && 'brand-compact')}>
    <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /><b /></span>
    {!compact && <span>Rao<span>Synapse</span></span>}
  </div>;
}

export function Avatar({ name, color, size = 'md', online }: { name: string; color?: string; size?: 'sm' | 'md' | 'lg'; online?: boolean | null }) {
  return <span className={cx('avatar', `avatar-${size}`)} style={{ background: color || '#7C5CFF' }} aria-label={name}>
    {initials(name)}
    {online !== undefined && online !== null && <i className={cx('presence-dot', online && 'online')} />}
  </span>;
}

export function Spinner({ label = 'Loading' }: { label?: string }) {
  return <span className="spinner" role="status" aria-label={label}><LoaderCircle size={18} /></span>;
}

export function PageLoader() {
  return <div className="page-loader"><Logo compact /><Spinner /><span>Connecting your workspace…</span></div>;
}

export function Modal({ title, description, children, onClose, wide = false }: { title: string; description?: string; children: ReactNode; onClose: () => void; wide?: boolean }) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = previous; };
  }, [onClose]);
  return <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <section className={cx('modal', wide && 'modal-wide')} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <header className="modal-header">
        <div><h2 id="modal-title">{title}</h2>{description && <p>{description}</p>}</div>
        <button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={19} /></button>
      </header>
      <div className="modal-body">{children}</div>
    </section>
  </div>;
}

export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: string; description: string; action?: ReactNode }) {
  return <div className="empty-state">
    <div className="empty-icon">{icon || <Sparkles size={25} />}</div>
    <h3>{title}</h3><p>{description}</p>{action}
  </div>;
}

export function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (checked: boolean) => void; label: string; description?: string }) {
  return <label className="toggle-row">
    <span><strong>{label}</strong>{description && <small>{description}</small>}</span>
    <input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)} />
    <i aria-hidden="true" />
  </label>;
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return <label className="field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>;
}
