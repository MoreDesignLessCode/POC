import React, { useEffect } from "react";
import UrlDetails from "../components/UrlDetails";
import "tailwindcss/tailwind.css";
import { useUrlStore } from "../store";
import axios from "axios";

type Props = {
  productId: string | number;
};

const Url: React.FC<Props> = ({ productId }) => {
  
  return (
    <>
      <UrlDetails />
    </>
  );
};

export default Url;
