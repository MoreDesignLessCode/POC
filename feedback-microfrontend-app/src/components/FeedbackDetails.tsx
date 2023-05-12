import React from "react";
import { useFeedbackStore } from "../store";
import FeedbackDetailsContent from "./FeedbackDetailsContent";
import FeedbackDetailsSidebar from "./FeedbackDetailsSidebar";
import NoReviews from "./FeedbackNoReviews";

const FeedbackDetails: React.FC = () => {
  const { reviews } = useFeedbackStore();
  return (
    <div className="mt-10 mb-10 flex flex-col-reverse lg:flex-row gap-10">
      {reviews.length > 0 ? (
        <>
          <FeedbackDetailsContent />
          <FeedbackDetailsSidebar />
        </>
      ) : (
        <NoReviews />
      )}
    </div>
  );
};

export default FeedbackDetails;
