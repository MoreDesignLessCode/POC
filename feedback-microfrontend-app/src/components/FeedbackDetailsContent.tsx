import React from "react";
import { useFeedbackStore } from "../store";
import FeedbackStaticStarRating from "./FeedbackStaticStarRating";

const FeedbackDetailsContent: React.FC = () => {
  const { reviews } = useFeedbackStore();

  console.log("reviews :>> ", reviews);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-5">
        {reviews.map((review: Review) => (
          <div className="w-full h-auto p-5 border border-[#949494] rounded-lg">
            <div className="flex items-center gap-2.5">
              <FeedbackStaticStarRating rating={review.rating} />
              <h3 className="font-bold">{review.summary}</h3>
            </div>
            <p className="text-sm font-medium mt-2.5 ">
              Posted by Test User on {review?.createdAt?.slice(0,10)}
            </p>
            <p className="mt-5 text-xs">{review.description}</p>
            <ul className="mt-5 flex items-center gap-2.5">
              {review?.tags?.map((tag) => (
                <li className="flex w-fit px-2 border border-black rounded-lg text-xs">
                  {tag}
                </li>
              ))}
            </ul>
            {/* Response */}
            {/* {review?.response?.author && (
              <div className="mt-5 ml-auto w-2/3 h-auto p-5 border border-[#949494] rounded-lg">
                <p className="text-sm font-medium">
                  Response from {review.response.author} on{" "}
                  {review.response.published}
                </p>
                <p className="mt-5 text-xs">{review.response.response}</p>
                &#11240;
              </div>
            )} */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackDetailsContent;
