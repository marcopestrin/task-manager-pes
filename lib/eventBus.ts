type Callback = () => void;
const listeners: Record<string, Callback[]> = {};

export const eventBus = {

  subscribe: (event: string, callback: Callback) => {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(callback);
  },

  unsubscribe: (event: string, callback: Callback) => {
    if (!listeners[event]) return;
    listeners[event] = listeners[event].filter((cb) => cb !== callback);
  },

  emit: (event: string) => {
    if (!listeners[event]) return;
    listeners[event].forEach((callback) => callback());
  },

};
