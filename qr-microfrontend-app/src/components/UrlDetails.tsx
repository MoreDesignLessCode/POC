import React, { useEffect, useRef, useState } from "react";
import { useUrlStore } from "../store";
import axios from "axios";
import FilterIcon from "../../public/images/filter.svg";


const UrlDetails: React.FC = () => {
    const { urlData, setUrlData } = useUrlStore();
    const urlRef = useRef(null);
    const [state, setState] = useState<string>('')
    const [pageNumber, setPageNumber] = useState<number>(0)
    const formRef = useRef(null);
    const urlIdRef = useRef(null);
    const createdByRef = useRef(null);
    const startDateRef = useRef(null);
    const endDateRef = useRef(null)
    let result;
    const handleSubmit = async (event: any) => {
        console.log(urlRef ?.current ?.value);
        event.preventDefault();
        const form = formRef.current;
        if (form.checkValidity() && urlRef.current.value != '') {
            try{
            const createRating = await axios.post('http://localhost:5000/urls/compress',
                {
                    name: urlRef ?.current ?.value
      }
            )
            result = createRating ?.data.data[0].compressedUrl
    setState(`Compressed Url: ${result}`)
            }
            catch (error) {
                console.log('Error-POST Url', error.message);
                }
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
            try{
            const createRating = await axios.post('http://localhost:5000/urls/compact',
                {
                    name: urlRef ?.current ?.value
      }
            )
            result = createRating ?.data.data[0].compactUrl
            setState(`Compact Url: ${result}`)}
            catch (error) {
                console.log('Error-POST URL', error.message);
                }
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

    useEffect(() => {
        fetchData(pageNumber)
    }, [pageNumber, state])

    const fetchData = async (pageNumber: number) => {
        let limitValue = 10;
        let offsetValue = pageNumber * limitValue
        let urlIds = urlIdRef ?.current ?.value == "" ? null : urlIdRef ?.current ?.value
        let createdByIds = createdByRef ?.current ?.value == "" ? null : createdByRef ?.current ?.value
        let startDate = startDateRef ?.current ?.value == "" ? null : startDateRef ?.current ?.value
        let endDate = endDateRef ?.current?.value == "" ? null : endDateRef ?.current ?.value
        let dateRangeVal = startDate == null || endDate == null ? null : `${startDate}~${endDate}`
        console.log(dateRangeVal)
        const params: any = {
            limit: limitValue,
            offset: offsetValue,
            "filter.id": urlIds,
            "filter.createdBy": createdByIds,
            "filter.dateRange": dateRangeVal,

        }
        try{
        const res = await axios.get(`http://localhost:5000/urls`, { params })
        console.log(res.data.data)
        setUrlData(res.data.data)
        }
        catch (error) {
            console.log('Error-GET URL', error.message);
            }
    }

    const handleFilterChange = () => {
        fetchData(0)
        setShowModal(false)

    }

    const [showModal, setShowModal] = useState(false)
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
            <>
                {showModal ? (
                    <>
                        <div
                            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                        >
                            <div className="relative w-[900px] my-6 mx-auto ">
                                {/*content*/}
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    {/*header*/}
                                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                        <h6 className="text-1xl font-semibold">
                                            Table Filters
                  </h6>
                                    </div>
                                    {/*body*/}
                                    <div>
                                        <div className="relative p-6 flex-auto">
                                            <label>Url Ids:</label>
                                            <input
                                                type="text"
                                                name="UrlIds"
                                                placeholder="Enter the url Uuids (',' separated)"
                                                className={
                                                    "rounded-lg h-[2.25rem] w-3/6  py-2.5 px-4 bg-gray-200  text-xs text-black font-semibold focus:bg-white border border-gray-200 mt-[.4375rem]"
                                                }
                                                ref={urlIdRef}

                                            />
                                        </div>
                                        <div className="relative p-6 flex-auto">
                                            <label>Created By Ids:</label>
                                            <input
                                                ref={createdByRef}
                                                type="text"
                                                name="Createdby"
                                                placeholder="Enter the Created by Uuids (',' separated)"
                                                className={
                                                    "rounded-lg h-[2.25rem] w-3/6  py-2.5 px-4 bg-gray-200  text-xs text-black font-semibold focus:bg-white border border-gray-200 mt-[.4375rem]"
                                                }
                                            />
                                        </div>
                                        <div className="relative p-6 flex-auto">
                                            <label>Date Range:</label>

                                            <input
                                                ref={startDateRef}
                                                type="date"
                                                name="date"
                                                placeholder="DD-MM-YY"
                                                className={
                                                    "rounded-lg h-[2.25rem] w-1/3  py-2.5 px-4 bg-gray-200  text-xs text-black font-semibold focus:bg-white border border-gray-200 mt-[.4375rem]"
                                                }
                                            />
                                            <span>{` ~ `}</span>
                                            <input
                                                ref={endDateRef}
                                                type="date"
                                                name="date"
                                                placeholder="DD-MM-YY"
                                                className={
                                                    "rounded-lg h-[2.25rem] w-1/3  py-2.5 px-4 bg-gray-200  text-xs text-black font-semibold focus:bg-white border border-gray-200 mt-[.4375rem]"
                                                }
                                            />
                                        </div>
                                    </div>
                                    {/*footer*/}
                                    <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                        <button
                                            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Close
                  </button>
                                        <button
                                            className="bg-emerald-500 text-blue active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => handleFilterChange()}
                                        >
                                            filter
                  </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    </>
                ) : null}
            </>

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
                            <th><button className="w-16" onClick={() => { setShowModal(true) }}><img
                                src={FilterIcon}
                                alt="filter"
                                // height={100}
                                // width={100}
                                className="h-[40px] w-[80px]"
                            ></img></button> </th>
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
