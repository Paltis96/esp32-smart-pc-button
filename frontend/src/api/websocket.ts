import { createSignal, onCleanup } from "solid-js";

export type WsStatus = "Connecting" | "Connected" | "Disconnected" | "Unavailable" | "Error";

const HANDSHAKE_TIMEOUT = 3000;
const RECONNECT_DELAY = 5000;
const HEARTBEAT_WATCHDOG = 7000;
let API_BASE: string

if (import.meta.env.DEV) { API_BASE = import.meta.env.VITE_API_URL }
else { API_BASE = window.location.hostname }



export function createWS() {
  const [data, setData] = createSignal<any>(null);
  const [status, setStatus] = createSignal<WsStatus>("Connecting");

  let socket: WebSocket | undefined;
  let reconnectTimer: any;
  let connectionTimeout: any;
  let heartbeatTimer: any

  const stopTimers = () => {
    clearTimeout(reconnectTimer);
    clearTimeout(connectionTimeout);
    clearTimeout(heartbeatTimer);
  };

  const resetHeartbeat = () => {
    clearTimeout(heartbeatTimer);
    heartbeatTimer = setTimeout(() => {
      console.warn("Heartbeat lost. Closing socket.");
      setStatus("Unavailable");
      socket?.close();
    }, HEARTBEAT_WATCHDOG);
  };


  const connect = () => {
    stopTimers();
    socket = new WebSocket(`ws://${API_BASE}/api/ws`);
    setStatus("Connecting");

    connectionTimeout = setTimeout(() => {
      if (socket?.readyState === WebSocket.CONNECTING) {
        console.warn("Connection handshake timed out."); socket.close();
      }
    }, HANDSHAKE_TIMEOUT);

    socket.onopen = () => {
      clearTimeout(connectionTimeout);
      setStatus("Connected");
    };

    socket.onmessage = (e) => {
      resetHeartbeat()

      if (e.data === 'ping') {
        socket?.send('pong');
        return;
      }

      try {
        setData(JSON.parse(e.data));
      } catch {
        setData(e.data);
      }
    };

    socket.onclose = () => {
      stopTimers();
      setStatus("Disconnected");
      reconnectTimer = setTimeout(connect, RECONNECT_DELAY);
    };

    socket.onerror = () => setStatus("Error");
  };

  connect();

  onCleanup(() => {
    stopTimers();
    socket?.close();
  });

  return { data, status };
}