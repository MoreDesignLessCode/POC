import React, { useRef, useState } from "react";
import { useFeedbackStore } from "../store";
import FeedbackDetailsContent from "./FeedbackDetailsContent";
import FeedbackDetailsSidebar from "./FeedbackDetailsSidebar";
import NoReviews from "./FeedbackNoReviews";
import { Alert } from "@procter-gamble/uxdl-react";
import axios from "axios";

const QrcodeDetails: React.FC = () => {
    const { reviews } = useFeedbackStore();
    const [state, setState] = useState('')
    const urlRef = useRef(null);

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const createRating = await axios.post('http://localhost:4000/qr',
            {
                location: urlRef?.current?.value
            }
        )
        setState(createRating?.data?.location)


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
                    className="text-xs py-2 px-9 focus:outline-black rounded-lg bg-[#003da5] text-white font-semibold"
                    onClick={handleSubmit}
                >
                    Generate
                </button>


                {/* </Alert.Action> */}
            </form>

            <div>
                <img src={state} />
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
                                Url
                            </th>
                            <th scope="col" className="px-6 py-3">
                                QRcode
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map((review: { id: any, createdBy: any, url: any, location: any }) =>
                            <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {review.id}
                                </th>
                                <td className="px-6 py-4">
                                    {review.createdBy}
                                </td>
                                <td className="px-6 py-4 break-all">
                                    {review.url}
                                </td>
                                <td className="px-6 py-4 break-all ">
                                    <img src={review.location} />

                                </td>

                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default QrcodeDetails