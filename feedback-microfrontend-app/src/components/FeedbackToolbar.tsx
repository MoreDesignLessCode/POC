import React from "react";
import FeedbackToolbarStart from "./FeedbackToolbarStart";
import FeedbackToolbarEnd from "./FeedbackToolbarEnd";

type Props = {};

const FeedbackToolbar: React.FC<Props> = (props) => {
  return (
    // <div className="mt-10 flex flex-col lg:flex-row gap-y-5 justify-between items-center">
    <div className="mt-10 ml-20 mr-20 flex flex-col lg:flex-row gap-y-5 justify-between items-center">
      <FeedbackToolbarStart />
      <FeedbackToolbarEnd />
    </div>
  );
};

export default FeedbackToolbar;
