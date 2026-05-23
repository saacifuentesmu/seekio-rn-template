export interface PushMessage {
  title?: string;
  body?: string;
  data?: Record<string, string>;
}

export interface PushService {
  init(): Promise<void>;
  getToken(): Promise<string | null>;
  onMessage(cb: (msg: PushMessage) => void): () => void;
}
