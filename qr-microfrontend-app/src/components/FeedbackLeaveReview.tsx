import { Alert, Button } from "@procter-gamble/uxdl-react";
import React, { useEffect, useRef, useState } from "react";
import FeedbackLeaveReviewStars from "./FeedbackLeaveReviewStars";
import { useNavigate } from 'react-router'
import axios from "axios";

type Props = {
  id: string;
};

const FeedbackLeaveReview: React.FC<Props> = ({ id }) => {

  const navigate = useNavigate()
  const titleRef= useRef(null);
  const descRef= useRef(null);
  const ratingRef= useRef(null)
  const handleSubmit=async(event:any)=>{
    alert(ratingRef.current.value)
    event.preventDefault();
   

  //   const createRating= await axios.post('http://localhost:4000/ratings',
  //   {
  //     rating:ratingRef.current.value,
  //     reference :"urn:com:pg:api:developer:feedback:v1:rating:388fa1cb-773e-472d-8916-efa5f792ecbb",
  //     participants: [
  //         {    
  //             profileId:"6083789e-c965-11ed-afa1-0242ac120002",
  //             addedBy: "6573fca6-a913-11ed-afa1-0242ac120007",
  //             status: "RESPONSIBLE"
  //         }
  //     ],
  //     messages:
  //         {
  //             summary: titleRef.current.value,
  //             description: descRef.current.value,
  //             status: "NEW",
  //             createdBy: "6573fca6-a913-11ed-afa1-0242ac120007",
  //             attachments:["3a87f3fc-c1a6-11ed-afa1-0242ac120002","f93f0070-c1a5-11ed-afa1-0242ac120002"]
  //         }
  // })
    navigate(0)

  }


  return (
    <Alert.Root>
      <Alert.Trigger>
        <div
          tabIndex={0}
          className="text-xs py-2 px-9 focus:outline-black rounded-lg bg-[#003da5] text-white font-semibold"
          role="button"
        >
          Leave a Review
        </div>
      </Alert.Trigger>
      <Alert.Content>
        <form>
          <Alert.Title className="font-bold">Leave a Review</Alert.Title>
          <Alert.Description>
            {/* Title */}
            <label
              htmlFor={`title__${id}`}
              className="font-semibold text-base mt-2"
            >
              Title
            </label>
            <input
              type="text"
              name="title"
              id={`title__${id}`}
              maxLength={150}
              required
              className={
                "rounded-lg h-[2.25rem] w-full py-2.5 px-4 bg-gray-200 text-xs text-black font-semibold focus:bg-white border border-gray-200 mt-[.4375rem]"
              }
              ref={titleRef}
            />
            {/* Description */}
            <label
              htmlFor={`description__${id}`}
              className="block mt-5 font-semibold text-base"
            >
              Description
            </label>
            <textarea
              name="description"
              id={`description__${id}`}
              rows={4}
              cols={50}
              required
              className={
                "w-full rounded-lg py-2.5 px-4 bg-gray-200 text-xs text-black font-semibold focus:bg-white border border-gray-200 mt-[.4375rem]"
              }
              ref={descRef}
            />
            {/* Rating */}
            <FeedbackLeaveReviewStars id={id} ratingRef={ratingRef}/>
          </Alert.Description>
          <Alert.Action className="mt-5" >
            <button
              // variant="primary"
              // rounded="small"
              className="text-xs py-2 px-9 focus:outline-black"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </Alert.Action>
          <Alert.Cancel className="mt-5">
            <Button
              variant="primary"
              outline
              rounded="small"
              className="text-xs py-2 px-9 focus:outline-black bg-white"
            >
              Cancel
            </Button>
          </Alert.Cancel>
        </form>
      </Alert.Content>
      <Alert.Overlay />
    </Alert.Root>
  );
};

export default FeedbackLeaveReview;
