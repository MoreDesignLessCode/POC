import React, { useEffect, useRef, useState } from "react";
import { useUrlStore } from "../store";
import axios from "axios";

const UrlDetails: React.FC = () => {
    const { urlData,setUrlData } = useUrlStore();
    const urlRef = useRef(null);
    const [state, setState] = useState<string>('')
    const [pageNumber, setPageNumber] = useState<number>(0)
    const formRef = useRef(null);
    let result;
    const handleSubmit = async (event: any) => {
        console.log(urlRef ?.current ?.value);
        event.preventDefault();
        const form = formRef.current;
        if (form.checkValidity() && urlRef.current.value != '') {
            const createRating = await axios.post('http://localhost:5000/urls/compress',
                {
                    name: urlRef ?.current ?.value
      }
            )
            result = createRating ?.data.data[0].compressedUrl
    setState(`Compressed Url: ${result}`)
        }
        else {
            // Form is invalid, handle the validation error
            console.log('Form is invalid');
            form.reportValidity();
        }
    }
    const compactHandler = async (event: any) => {
        console.log(urlRef ?.current ?.value);
        event.preventDefault();
        const form = formRef.current;
        console.log(urlRef.current.value)
        if (form.checkValidity() && urlRef.current.value != '') {
            const createRating = await axios.post('http://localhost:5000/urls/compact',
                {
                    name: urlRef ?.current ?.value
      }
            )
            result = createRating ?.data.data[0].compactUrl
            setState(`Compact Url: ${result}`)
        } else {
            // Form is invalid, handle the validation error
            console.log('Form is invalid');
            form.reportValidity();
        }
    }

    const pagenationHandler = (type: string) => {
        if (type == "increment") {
            setPageNumber(pageNumber => pageNumber + 1)
        }
        if (type == "decrement") {
            setPageNumber(pageNumber => pageNumber - 1)
        }
    }

    useEffect(()=>{
        fetchData(pageNumber)
    },[pageNumber,state])

    const fetchData=async(pageNumber:number)=>{
        let limit=10;
        let offset=pageNumber*limit
        const res=await  axios.get(`http://localhost:5000/urls?limit=${limit}&offset=${offset}`)
        console.log(res.data.data)
        setUrlData(res.data.data)
       }
    return (
        <div>
            <form className={'ml-52 mt-4'} ref={formRef}>
                <input
                    type="url"
                    name="Url"
                    placeholder="Enter the url"
                    className={
                        "rounded-lg h-[2.25rem] w-3/6  py-2.5 px-4 bg-gray-200  text-xs text-black font-semibold focus:bg-white border border-gray-200 mt-[.4375rem]"
                    }
                    ref={urlRef}
                />

                <button
                    className="text-xs mx-9 py-2 px-9 focus:outline-black rounded-lg bg-[#003da5] text-white font-semibold"
                    onClick={compactHandler}
                >
                    Compact
                </button>

                <button
                    className="text-xs py-2 px-9 focus:outline-black rounded-lg bg-[#003da5] text-white font-semibold"
                    onClick={handleSubmit}
                >
                    Compress
                </button>
            </form>

            <div className="ml-[26rem] font-semibold mt-10 w-[40rem] break-all">
                {state}
            </div>

            <div className="relative  overflow-x-auto  sm:rounded-lg mt-10">
                <table className="w-2/3 mx-auto border-solid border-2 border-#003da5  text-sm text-left text-gray-500 ">
                    <thead className="text-xs text-white font-semibold uppercase bg-blue-900 ">
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
                        {urlData ?.map((review: { id: any, createdBy: any, originalUrl: any, compressedUrl: any, compactUrl: any }) =>
                            <tr className="bg-white border-b">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 ">
                                    {review.id}
                                </th>
                                <td className="px-6 py-4">
                                    {review.createdBy}
                                </td>
                                <td className="px-6 py-4 break-all">
                                    {review.originalUrl}
                                </td>
                                <td className="px-6 py-4 break-all 	">
                                    {review.compressedUrl == null ? "NOT GENERATED" : review.compressedUrl}
                                </td>
                                <td className="px-6 py-4 break-all">
                                    {review.compactUrl == null ? "NOT GENERATED" : review.compactUrl}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center p-4">
                <button
                    disabled={pageNumber ? false : true}
                    onClick={() => pagenationHandler("decrement")}
                    className="inline-flex items-center text-xs py-2 px-9 focus:outline-black rounded-lg bg-[#003da5] text-white font-semibold disabled:opacity-25 ">
                    {`< Previous`}
                </button>


                <button
                    onClick={() => pagenationHandler("increment")}
                    className="inline-flex items-center text-xs py-2 px-9 ml-3 focus:outline-black rounded-lg bg-[#003da5] text-white font-semibold">
                    {`Next >`}
                </button>
            </div>
        </div>
    );
};

export default UrlDetails;
