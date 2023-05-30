import React, { useEffect, useRef, useState } from "react";
import FeedbackLeaveReviewStars from "./FeedbackLeaveReviewStars";
import { useNavigate } from 'react-router'
import axios from "axios";
import "./FeedbackLeaveReview.css";

type Props = {
  id: string;
};

const FeedbackLeaveReview: React.FC<Props> = ({ id }) => {

  // const navigate = useNavigate()
  const titleRef= useRef(null);
  const descRef= useRef(null);
  const ratingRef= useRef(null)
  const handleSubmit=async(event:any)=>{

    event.preventDefault();

    const createRating= await axios.post('http://localhost:4000/ratings',
    {
      rating:ratingRef.current.value,
      reference :"urn:com:pg:api:developer:feedback:v1:rating:388fa1cb-773e-472d-8916-efa5f792ecbb",
      participants: [
          {    
              profileId:"6083789e-c965-11ed-afa1-0242ac120002",
              addedBy: "6573fca6-a913-11ed-afa1-0242ac120007",
              status: "RESPONSIBLE"
          }
      ],
      messages:
          {
              summary: titleRef.current.value,
              description: descRef.current.value,
              status: "NEW",
              createdBy: "6573fca6-a913-11ed-afa1-0242ac120007",
              attachments:["3a87f3fc-c1a6-11ed-afa1-0242ac120002","f93f0070-c1a5-11ed-afa1-0242ac120002"]
          }
  })
  window.location.reload()
    // navigate(0)

  }
const [modal,setModal] =useState(false)
const modalHandler=()=>{
  setModal(true)
} 
  return (
    <>
      <button
        tabIndex={0}
        className="text-xs  py-2 px-9 focus:outline-black rounded-lg bg-[#003da5] text-white font-semibold"
        role="button"
        onClick={modalHandler}
      >
        Leave a Review
      </button>
      {modal && (
        <div className="leave-review-container">
          <div className="form-header">
            <div><h4>Leave A Review</h4> </div>
            <button style={{ marginLeft: "auto" }} onClick={() => { setModal(false) }}> <strong>X</strong></button>

          </div>

          <form>
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
            <FeedbackLeaveReviewStars id={id} ratingRef={ratingRef} />
            <button
              // variant="primary"
              // rounded="small"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={handleSubmit}
            >
              Submit
            </button>

            <button
              // variant="primary"
              //outline
              //rounded="small"
              className="text-xs py-2 px-9 focus:outline-black bg-white"
              onClick={() => { setModal(false) }}
            >
              Cancel
            </button>
          </form>
        </div>
      )
      }
    </>
  
  )
};

export default FeedbackLeaveReview;
