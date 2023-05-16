import React, { useEffect } from "react";
import FeedbackDetails from "../components/FeedbackDetails";
import FeedbackToolbar from "../components/FeedbackToolbar";
import "tailwindcss/tailwind.css";
import reviewsData from "../data";
import { useFeedbackStore } from "../store";
import axios from "axios";
import QrcodeDetails from "../components/QrcodeDetails";

type Props = {
  productId: string | number;
};

const Qrcode: React.FC<Props> = ({ productId }) => {
     const { setReviews } = useFeedbackStore();

  useEffect(() => {
     fetchData()
    // setReviews(reviewsData); // will need to be set up to be a dynamic value drawing from product data retrieved with productId
  }, []);

  const fetchData=async()=>{
   const res=await  axios.get(' http://localhost:4000/qr')
   setReviews(res.data)
  }
  return(
   <QrcodeDetails/>
  )

}
export default Qrcode