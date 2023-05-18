import React, { useEffect } from "react";
import "tailwindcss/tailwind.css";
import { useUrlStore } from "../store";
import axios from "axios";
import QrcodeDetails from "../components/QrcodeDetails";

type Props = {
  productId: string | number;
};

const Qrcode: React.FC<Props> = ({ productId }) => {

  return(
   <QrcodeDetails/>
  )

}
export default Qrcode