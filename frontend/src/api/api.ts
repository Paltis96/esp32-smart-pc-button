export interface AppConfig {
  auto_power_on: boolean;
  host_ip: string;
  target_ip: string;
  retries: number;
  heartbeat_interval_s: number;
}

export interface PingStat { host_history: boolean[]; target_history: boolean[] }

export interface Responce {
  message: string
  status: string
  data?: AppConfig
}

let API_BASE: string

if (import.meta.env.DEV) { API_BASE = import.meta.env.VITE_API_URL }
else { API_BASE = window.location.hostname }


async function request<T>(path: string, options: RequestInit = {}): Promise<T> {

  try {
    const res = await fetch(`http://${API_BASE}/api${path}`, { ...options, signal: AbortSignal.timeout(6000) });

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    }

    return (await res.text()) as T;

  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`ESP32 Communication Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred");
  }
}


export const api = {
  getConfig: () =>
    request<Responce>('/config'),
  getPingStat: () =>
    request<Responce>('/ping_status')
  ,
  retryClear: () => request('/retry_clear'),
  updateConfig: (data: Partial<AppConfig>) =>
    request<Responce>('/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  triggerSignal: () => request<Responce>('/signal'),
  rebootSystem: () => request<Responce>('/sys/reboot'),
  espInfo: () => request<Responce>('/sys/info'),

};