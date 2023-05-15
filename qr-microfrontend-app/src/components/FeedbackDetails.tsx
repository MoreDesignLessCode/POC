import React, { useRef ,useState} from "react";
import { useFeedbackStore } from "../store";
import FeedbackDetailsContent from "./FeedbackDetailsContent";
import FeedbackDetailsSidebar from "./FeedbackDetailsSidebar";
import NoReviews from "./FeedbackNoReviews";
import { Alert } from "@procter-gamble/uxdl-react";
import axios from "axios";

const FeedbackDetails: React.FC = () => {
  const { reviews } = useFeedbackStore();
  const urlRef= useRef(null);
  const [state,setState] =useState('')
  let result;
  const handleSubmit=async(event:any)=>{
    console.log(urlRef?.current?.value);
    event.preventDefault();
    const createRating= await axios.post('http://localhost:4000/urls/compress',
      {
        name:urlRef?.current?.value
      }
    )
    result=createRating?.data.data[0].compactUrl
    setState(result)
  }
  const compactHandler=async(event:any)=>{
    console.log(urlRef?.current?.value);
    event.preventDefault();
    const createRating= await axios.post('http://localhost:4000/urls/compact',
      {
        name:urlRef?.current?.value
      }
    )
    result=createRating?.data.data[0].compactUrl
    setState(result)
  }
  
  return (
  
    <div>
      <form>
        <input
          type="text"
          name="Url"
          className={
            "rounded-lg h-[2.25rem] w-3/6 py-2.5 px-4 bg-gray-200 text-xs text-black font-semibold focus:bg-white border border-gray-200 mt-[.4375rem]"
          }
          ref={urlRef}
        />
      
        <button
            // variant="primary"
            // rounded="small"
            className="text-xs mx-9 py-2 px-9 focus:outline-black rounded-lg bg-[#003da5] text-white font-semibold"
            onClick={compactHandler}
          >
            Compact
          </button>
      
          <button
            // variant="primary"
            // rounded="small"
            className="text-xs py-2 px-9 focus:outline-black rounded-lg bg-[#003da5] text-white font-semibold"
            onClick={handleSubmit}
          >
            Compress
          </button>
     
          
        {/* </Alert.Action> */}
      </form>

      <div>
       {state}
      </div>
    </div>
  );
};

export default FeedbackDetails;
