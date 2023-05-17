import React, { useEffect } from "react";
import UrlDetails from "../components/UrlDetails";
import "tailwindcss/tailwind.css";
import { useUrlStore } from "../store";
import axios from "axios";

type Props = {
  productId: string | number;
};

const Url: React.FC<Props> = ({ productId }) => {
  const { setUrlData } = useUrlStore();

  useEffect(() => {
     fetchData()
    // setReviews(reviewsData); // will need to be set up to be a dynamic value drawing from product data retrieved with productId
  }, []);

  const fetchData=async()=>{
   const res=await  axios.get(' http://localhost:5000/urls')
   console.log(res.data.data)
   setUrlData(res.data.data)
  }
  return (
    <>
      <UrlDetails />
    </>
  );
};

export default Url;
