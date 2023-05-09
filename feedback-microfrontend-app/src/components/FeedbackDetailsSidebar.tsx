import React from "react";
import { useFeedbackStore } from "../store";
import FeedbackStaticStarRating from "./FeedbackStaticStarRating";

const FeedbackDetailsSidebar: React.FC = () => {
  const { reviews } = useFeedbackStore();

  let sum = 0;
  reviews.forEach((review: Review) => {
    sum += review.rating;
  });

  const averageRating = Math.round(sum / reviews.length / 0.5) * 0.5;

  return (
    <div className="lg:min-w-[279px]">
      <ul className="border border-[#949494] rounded-lg border-2 p-5">
        <li>
          <p className="font-bold">Overall Rating</p>
        </li>
        <li className="mt-2">
          <p className="text-sm font-medium">{averageRating} out of 5</p>
        </li>
        <li className="mt-2.5">
          <FeedbackStaticStarRating rating={averageRating} />
        </li>
      </ul>
    </div>
  );
};

export default FeedbackDetailsSidebar;
