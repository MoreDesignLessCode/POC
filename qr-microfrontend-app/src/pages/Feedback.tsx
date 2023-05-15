import React, { useEffect } from "react";
import FeedbackDetails from "../components/FeedbackDetails";
import FeedbackToolbar from "../components/FeedbackToolbar";
import "tailwindcss/tailwind.css";
import reviewsData from "../data";
import { useFeedbackStore } from "../store";
import axios from "axios";

type Props = {
  productId: string | number;
};

const Feedback: React.FC<Props> = ({ productId }) => {
  const { setReviews } = useFeedbackStore();

  // useEffect(() => {
  //    fetchData()
  //   // setReviews(reviewsData); // will need to be set up to be a dynamic value drawing from product data retrieved with productId
  // }, []);

  // const fetchData=async()=>{
  //  const res=await  axios.get(' http://localhost:4000/ratings?includes=messages')
  //  console.log(res.data.data)
  //  setReviews(res.data.data)
  // }
  return (
    <>
      {/* <FeedbackToolbar /> */}
      <FeedbackDetails />
    </>
  );
};

export default Feedback;
