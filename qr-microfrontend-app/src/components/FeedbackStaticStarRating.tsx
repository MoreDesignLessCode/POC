import React from "react";
import "./FeedbackStaticStarRating.css";

type Props = {
  rating: number | string;
};

const FeedbackStaticStarRating: React.FC<Props> = ({ rating }) => {
  const arr = [5, 4, 3, 2, 1];

  return (
    <div className="flex items-center w-[10rem] flex-row-reverse justify-between relative">
      {arr.map((num) => (
        <label
          key={num}
          className={`${
            rating >= num
              ? "full"
              : num - (rating as number) == 0.5
              ? "half"
              : "empty"
          } w-[30px] h-[30px] text-3xl text-[#F1B434] before:absolute before:top-0 before:leading-[1.625rem]`}
        />
      ))}
    </div>
  );
};

export default FeedbackStaticStarRating;
