import { IEpisodeServer } from '@/constants/types';
import { create } from 'zustand';

interface ServerState {
  servers: IEpisodeServer[];
  currentServer: IEpisodeServer | null;
  setServers: (servers: IEpisodeServer[]) => void;
  getServers: () => IEpisodeServer[];
  setCurrentServer: (serverName: string) => void;
  getCurrentServer: () => IEpisodeServer | null;
  getServerByName: (name: string) => IEpisodeServer | undefined;
  getServerUrl: (name: string) => string | undefined;
}

export const useServerStore = create<ServerState>((set, get) => ({
  servers: [],
  currentServer: null,

  setServers: (servers) => {
    set({ servers });
  },

  getServers: () => get().servers,

  setCurrentServer: (serverName) => {
    const server = get().servers.find((s) => s.name === serverName);
    if (server) {
      set({ currentServer: server });
    }
  },

  getCurrentServer: () => get().currentServer,

  getServerByName: (name) => get().servers.find((s) => s.name === name),

  getServerUrl: (name) => get().servers.find((s) => s.name === name)?.url,
}));
