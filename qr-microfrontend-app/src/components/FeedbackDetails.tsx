import React, { useRef, useState } from "react";
import { useFeedbackStore } from "../store";
import FeedbackDetailsContent from "./FeedbackDetailsContent";
import FeedbackDetailsSidebar from "./FeedbackDetailsSidebar";
import NoReviews from "./FeedbackNoReviews";
import { Alert } from "@procter-gamble/uxdl-react";
import axios from "axios";

const FeedbackDetails: React.FC = () => {
    const { reviews } = useFeedbackStore();
    const urlRef = useRef(null);
    const [state, setState] = useState('')
    let result;
    const handleSubmit = async (event: any) => {
        console.log(urlRef ?.current ?.value);
        event.preventDefault();
        const createRating = await axios.post('http://localhost:4000/urls/compress',
            {
                name: urlRef ?.current ?.value
      }
        )
        result = createRating ?.data.data[0].compactUrl
    setState(result)
    }
    const compactHandler = async (event: any) => {
        console.log(urlRef ?.current ?.value);
        event.preventDefault();
        const createRating = await axios.post('http://localhost:4000/urls/compact',
            {
                name: urlRef ?.current ?.value
      }
        )
        result = createRating ?.data.data[0].compactUrl
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

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Id
                </th>
                            <th scope="col" className="px-6 py-3">
                                Created By
                </th>
                            <th scope="col" className="px-6 py-3">
                                Original Url
                </th>
                            <th scope="col" className="px-6 py-3">
                                Compressed Url
                </th>
                            <th scope="col" className="px-6 py-3">
                                Compact Url
                </th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map((review: { id: any, createdBy: any, originalUrl: any, compressedUrl: any, compactUrl: any }) =>
                            <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {review.id}
                </th>
                                <td className="px-6 py-4">
                                {review.createdBy}
                </td>
                                <td className="px-6 py-4 break-all">
                                {review.originalUrl}
                </td>
                                <td className="px-6 py-4 break-all ">
                                {review.compressedUrl == null ? "NOT GENERATED" : review.compressedUrl}
                               
                </td>
                                <td className="px-6 py-4">
                                {review.compactUrl == null ? "NOT GENERATED" : review.compactUrl}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FeedbackDetails;
