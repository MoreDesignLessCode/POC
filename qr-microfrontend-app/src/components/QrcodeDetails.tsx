import React, { useEffect, useRef, useState } from "react";
import { useUrlStore } from "../store";

import axios from "axios";

const QrcodeDetails: React.FC = () => {
    const { urlData, setUrlData } = useUrlStore();
    const [state, setState] = useState('')
    const urlRef = useRef(null);
    const [pageNumber, setPageNumber] = useState<number>(0)

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const createRating = await axios.post('http://localhost:5000/qr',
            {
                location: urlRef ?.current ?.value
            }
        )
        setState(createRating ?.data ?.location)


    }

    useEffect(() => {
        fetchData(pageNumber)
    }, [pageNumber, state])

    const fetchData = async (pageNumber: number) => {
        let limit = 10;
        let offset = pageNumber * limit
        const res = await axios.get(`http://localhost:5000/qr?limit=${limit}&offset=${offset}`)
        setUrlData(res.data)
    }

    const pagenationHandler = (type: string) => {
        if (type == "increment") {
            setPageNumber(pageNumber => pageNumber + 1)
        }
        if (type == "decrement") {
            setPageNumber(pageNumber => pageNumber - 1)
        }
    }
    return (
        <div>
            <form className={'ml-56 mt-4 mb-4'} >
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
                    className="text-xs py-2 mx-9 px-9 focus:outline-black rounded-lg bg-[#003da5] text-white font-semibold"
                    onClick={handleSubmit}
                >
                    Generate
                </button>


                {/* </Alert.Action> */}
            </form>

            <div className="ml-[38rem]">
                {state != '' && <>
                    <p className="ml-7 font-semibold">Generated</p>
                    <img src={state} />
                </>
                }
            </div>
            {urlData.length==0 &&<div className="font-semibold uppercase ml-[36rem]"> No available Qr codes </div>}
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                {urlData.length>0&& <table className="w-2/3 mx-auto border-solid border-2 border-#003da5 text-sm text-left text-gray-500 ">
                    <thead className="text-xs text-white font-semibold uppercase bg-blue-900 ">
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
                        {urlData.map((review: { id: any, createdBy: any, url: any, location: any }) =>
                            <tr className="bg-white border-b  ">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
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
                </table>}
            </div>
            <div className="flex justify-center p-4">
                <button
                    disabled={pageNumber ? false : true}
                    onClick={() => pagenationHandler("decrement")}
                    className="inline-flex items-center text-xs py-2 px-9 focus:outline-black rounded-lg bg-[#003da5] text-white font-semibold disabled:opacity-25 ">
                    {`< Previous`}
                </button>


                <button
                    disabled={urlData.length == 0 ? true : false}
                    onClick={() => pagenationHandler("increment")}
                    className="inline-flex items-center text-xs py-2 px-9 ml-3 focus:outline-black rounded-lg bg-[#003da5] text-white font-semibold disabled:opacity-25">
                    {`Next >`}
                </button>
            </div>
        </div>
    )
}
export default QrcodeDetails