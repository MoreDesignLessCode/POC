import { create } from "zustand";

interface FeedbackState {
  reviews: {}[];
  setReviews: (reviews: {}[]) => void;
}

export const useFeedbackStore = create<FeedbackState>()((set) => ({
  reviews: [],
  setReviews: (reviews: {}[]) => {
    set(() => ({ reviews: [...reviews] }));
  },
}));
