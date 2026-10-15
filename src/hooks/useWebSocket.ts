import { useEffect, useRef, useState } from "react";

export function useWebSocket(url: string | null, onMessage?: (data: string) => void) {
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  });

  useEffect(() => {
    if (!url) {
      return;
    }

    let closed = false;
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      if (!closed) setIsConnected(true);
    };
    socket.onclose = () => {
      if (!closed) setIsConnected(false);
    };
    socket.onerror = () => {
      if (!closed) setIsConnected(false);
    };
    socket.onmessage = (event) => {
      const data = String(event.data);
      setMessages((prev) => [...prev, data]);
      onMessageRef.current?.(data);
    };

    return () => {
      closed = true;
      setIsConnected(false);
      socket.close();
      socketRef.current = null;
    };
  }, [url]);

  const sendMessage = (data: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.send(data);
    }
  };

  return { messages, isConnected, sendMessage };
}
