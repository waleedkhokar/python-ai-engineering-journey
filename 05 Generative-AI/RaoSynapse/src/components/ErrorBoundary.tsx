import { Component, type ErrorInfo, type ReactNode } from 'react';
import { RefreshCw, ShieldAlert } from 'lucide-react';
import { Logo } from './UI';

export default class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('RaoSynapse interface error', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return <main className="fatal-error" role="alert">
        <Logo />
        <span><ShieldAlert size={27} /></span>
        <h1>The workspace hit an unexpected interface error.</h1>
        <p>Your persisted conversations and research are still on the server. Reload the interface to reconnect.</p>
        <button className="button primary" onClick={() => location.reload()}><RefreshCw size={16} />Reload RaoSynapse</button>
      </main>;
    }
    return this.props.children;
  }
}
