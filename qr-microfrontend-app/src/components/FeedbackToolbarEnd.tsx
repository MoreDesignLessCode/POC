import React from "react";
import FeedbackLeaveReview from "./FeedbackLeaveReview";

type Props = {};

const FeedbackToolbarEnd: React.FC<Props> = (props) => {
  return (
    <div className="flex items-center gap-5">
      <FeedbackLeaveReview id="feedback-toolbar-end" />
    </div>
  );
};

export default FeedbackToolbarEnd;
