import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useAuth } from './auth';

type Listener = (event: any) => void;
type RealtimeValue = { connected: boolean; addListener: (listener: Listener) => () => void; send: (event: unknown) => void };
const RealtimeContext = createContext<RealtimeValue | null>(null);

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);
  const socket = useRef<WebSocket | null>(null);
  const listeners = useRef(new Set<Listener>());

  useEffect(() => {
    if (!user) return;
    let closed = false;
    let retry: ReturnType<typeof setTimeout>;
    const connect = () => {
      const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
      const ws = new WebSocket(`${protocol}//${location.host}/ws`);
      socket.current = ws;
      ws.onopen = () => setConnected(true);
      ws.onmessage = message => {
        try {
          const event = JSON.parse(message.data);
          listeners.current.forEach(listener => listener(event));
        } catch { /* Ignore malformed events. */ }
      };
      ws.onclose = () => {
        setConnected(false);
        if (!closed) retry = setTimeout(connect, 1600);
      };
      ws.onerror = () => ws.close();
    };
    connect();
    return () => {
      closed = true;
      clearTimeout(retry);
      socket.current?.close();
      socket.current = null;
      setConnected(false);
    };
  }, [user?.id]);

  const value: RealtimeValue = {
    connected,
    addListener: listener => {
      listeners.current.add(listener);
      return () => listeners.current.delete(listener);
    },
    send: event => {
      if (socket.current?.readyState === WebSocket.OPEN) socket.current.send(JSON.stringify(event));
    },
  };
  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
}

export function useRealtime() {
  const value = useContext(RealtimeContext);
  if (!value) throw new Error('useRealtime must be used inside RealtimeProvider');
  return value;
}
