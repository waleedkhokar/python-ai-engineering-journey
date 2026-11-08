import { lazy, Suspense, type ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './lib/auth';
import { PageLoader } from './components/UI';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import About from './pages/About';

const Layout = lazy(() => import('./components/Layout'));
const ConversationWorkspace = lazy(() => import('./components/ConversationWorkspace'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Research = lazy(() => import('./pages/Research'));
const Developer = lazy(() => import('./pages/Developer'));
const Settings = lazy(() => import('./pages/Settings'));
const Shared = lazy(() => import('./pages/Shared'));

function Protected({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/shared/:token" element={<Protected><Shared /></Protected>} />
      <Route path="/app" element={<Protected><Layout /></Protected>}>
        <Route index element={<Dashboard />} />
        <Route path="ai" element={<ConversationWorkspace kind="ai" />} />
        <Route path="ai/:id" element={<ConversationWorkspace kind="ai" />} />
        <Route path="messages" element={<ConversationWorkspace kind="direct" />} />
        <Route path="messages/:id" element={<ConversationWorkspace kind="direct" />} />
        <Route path="rooms" element={<ConversationWorkspace kind="room" />} />
        <Route path="rooms/:id" element={<ConversationWorkspace kind="room" />} />
        <Route path="research" element={<Research />} />
        <Route path="developer" element={<Developer />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>;
}
