import React, { useEffect } from "react";
import "tailwindcss/tailwind.css";
import { useUrlStore } from "../store";
import axios from "axios";
import QrcodeDetails from "../components/QrcodeDetails";

type Props = {
  productId: string | number;
};

const Qrcode: React.FC<Props> = ({ productId }) => {
     const { setUrlData } = useUrlStore();

  useEffect(() => {
     fetchData()
    // setReviews(reviewsData); // will need to be set up to be a dynamic value drawing from product data retrieved with productId
  }, []);

  const fetchData=async()=>{
   const res=await  axios.get(' http://localhost:4000/qr')
   setUrlData(res.data)
  }
  return(
   <QrcodeDetails/>
  )

}
export default Qrcode