import { create } from "zustand";

interface FeedbackState {
  reviews: any;
  setReviews: (reviews: {}[]) => void;
}

export const useFeedbackStore = create<FeedbackState>()((set) => ({
  reviews: [],
  setReviews: (reviews: any) => {
    set(() => ({ reviews: [...reviews] }));
  },
}));
