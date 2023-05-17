import { create } from "zustand";

interface UrlState {
  urlData: any;
  setUrlData: (urlData: {}[]) => void;
}

export const useUrlStore = create<UrlState>()((set) => ({
  urlData: [],
  setUrlData: (urlData: any) => {
    set(() => ({ urlData: [...urlData] }));
  },
}));
