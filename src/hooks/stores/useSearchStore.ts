import { create } from 'zustand';
import debounce from 'lodash/debounce';

interface SearchStore {
  searchQuery: string;
  debouncedQuery: string;
  setSearchQuery: (query: string) => void;
  setDebouncedQuery: (query: string) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  searchQuery: '',
  debouncedQuery: '',
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setDebouncedQuery: debounce((query: string) => {
    set({ debouncedQuery: query });
  }, 1000),
}));
