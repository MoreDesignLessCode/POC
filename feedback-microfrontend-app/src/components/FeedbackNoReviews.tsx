import React from "react";
import StarIcon from "../../public/images/star.svg";
import FeedbackLeaveReview from "./FeedbackLeaveReview";
import "./FeedbackNoReviews.css";

type Props = {};

const NoReviews: React.FC<Props> = (props) => {
  return (
    <div className="w-full">    
      <div className="noreview-wrapper" >
        <div className="flex justify-center items-center mt-5">
          <img
            src={StarIcon}
            alt="star"
            height={24}
            width={24}
            className="h-[24px] w-[24px]"
          ></img>
          <img
            src={StarIcon}
            alt="star"
            height={24}
            width={24}
            className="h-[24px] w-[24px]"
          ></img>
          <img
            src={StarIcon}
            alt="star"
            height={24}
            width={24}
            className="h-[24px] w-[24px]"
          ></img>
          <img
            src={StarIcon}
            alt="star"
            height={24}
            width={24}
            className="h-[24px] w-[24px]"
          ></img>
          <img
            src={StarIcon}
            alt="star"
            height={24}
            width={24}
            className="h-[24px] w-[24px]"
          ></img>
        </div>
        <div className="title">
          No Reviews Yet
          </div>    
        <div className="description">
          Be the <strong>first</strong> to leave a review!
          </div>
        <div className="review">
          <FeedbackLeaveReview id="feedback-no-reviews" />
          </div>
      </div>
    </div>
  );
};

export default NoReviews;
