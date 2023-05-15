import React from "react";
import "./FeedbackLeaveReviewStars.css";

type Props = {
  id: string;
  ratingRef:any
};

const FeedbackLeaveReviewStars: React.FC<Props> = ({ id,ratingRef}) => {
  const handleStarKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      const input = (event.target as HTMLLabelElement)
        .previousElementSibling as HTMLInputElement;

      input.click();
     
    }
 
  };

  const handleChange=(event :any)=>{
     ratingRef.current.value= event.target.value
  }

  return (
    <>
      <label className="block mt-5 font-semibold text-base">Rating</label>
      <div className="star-rating flex items-center w-[10rem] flex-row-reverse justify-between my-5 mx-auto relative" onChange={handleChange} ref={ratingRef} >
        <input
          type="radio"
          name="stars"
          id={`star-a__${id}`}
          value="5"
          className="hidden"
        />
        <label
          htmlFor={`star-a__${id}`}
          tabIndex={0}
          onKeyDown={(e) => handleStarKeyDown(e)}
          className="w-[30px] h-[30px] text-3xl text-[#F1B434] ease-in-out duration-200 hover:text-black before:content-['\2606'] before:absolute before:top-0 before:leading-[1.625rem]"
        ></label>

        <input
          type="radio"
          name="stars"
          id={`star-b__${id}`}
          value="4"
          className="hidden"
        />
        <label
          htmlFor={`star-b__${id}`}
          tabIndex={0}
          onKeyDown={(e) => handleStarKeyDown(e)}
          className="w-[30px] h-[30px] text-3xl text-[#F1B434] ease-in-out duration-200 hover:text-black before:content-['\2606'] before:absolute before:top-0 before:leading-[1.625rem]"
        ></label>

        <input
          type="radio"
          name="stars"
          id={`star-c__${id}`}
          value="3"
          className="hidden"
        />
        <label
          htmlFor={`star-c__${id}`}
          tabIndex={0}
          onKeyDown={(e) => handleStarKeyDown(e)}
          className="w-[30px] h-[30px] text-3xl text-[#F1B434] ease-in-out duration-200 hover:text-black before:content-['\2606'] before:absolute before:top-0 before:leading-[1.625rem]"
        ></label>

        <input
          type="radio"
          name="stars"
          id={`star-d__${id}`}
          value="2"
          className="hidden"
        />
        <label
          htmlFor={`star-d__${id}`}
          tabIndex={0}
          onKeyDown={(e) => handleStarKeyDown(e)}
          className="w-[30px] h-[30px] text-3xl text-[#F1B434] ease-in-out duration-200 hover:text-black before:content-['\2606'] before:absolute before:top-0 before:leading-[1.625rem]"
        ></label>

        <input
          type="radio"
          name="stars"
          id={`star-e__${id}`}
          value="1"
          className="hidden"
        />
        <label
          htmlFor={`star-e__${id}`}
          tabIndex={0}
          onKeyDown={(e) => handleStarKeyDown(e)}
          className="w-[30px] h-[30px] text-3xl text-[#F1B434] ease-in-out duration-200 hover:text-black before:content-['\2606'] before:absolute before:top-0 before:leading-[1.625rem]"
        ></label>
      </div>
    </>
  );
};

export default FeedbackLeaveReviewStars;
