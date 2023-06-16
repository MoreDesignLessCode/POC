import React, { useEffect, useRef, useState } from "react";
import { useUrlStore } from "../store";
import FilterIcon from "../../public/images/filter.svg";

import axios from "axios";

const QrcodeDetails: React.FC = () => {
    //const filterRef = useRef(null);
    const qrIdRef = useRef(null);
    const createdByRef = useRef(null);
    const startDateRef = useRef(null);
    const endDateRef = useRef(null)
    const [submit,setSubmit] =useState(false)
    const errorRef: any = useRef(null);
    const maskRef :any = useRef(null);
    const marginRef :any = useRef(null);
    const formRef = useRef(null);
    const { urlData, setUrlData } = useUrlStore();
    const [state, setState] = useState('')
    const urlRef = useRef(null);
    const [pageNumber, setPageNumber] = useState<number>(0)
    const [showModal, setShowModal] = useState(false)
    const [showFilterModal, setShowFilterModal] = useState(false)

    const modalHandler =(event:any)=>{
        event.preventDefault();
        const form = formRef.current;
        
        if (form.checkValidity() && urlRef.current.value != '') {
        setShowModal(true)
        }
        else {
            // Form is invalid, handle the validation error
            
            form.reportValidity();
        }
    }
    
    const handleFilterChange = () => {
        fetchData(0)
        setShowFilterModal(false)

    }

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        //setShowModal(true)
        const errorCorrectionLevel=errorRef.current.value
        const mask=maskRef.current.value
        const quiteZone= marginRef.current.value
        const errorCorrectionTest = errorRef.current;
      
        const params: any = {
            errorCorrectionLevel: errorCorrectionLevel,
            maskPattern:mask,
            quiteZone:quiteZone
        }
        if(urlRef.current.value!=''&&errorCorrectionTest.checkValidity()){
            try{
        const createRating = await axios.post('http://localhost:5000/qr',
            {
                location: urlRef ?.current ?.value
            },
            {params}
        )
        setState(createRating ?.data ?.location)
        setShowModal(false)
        }
        catch (error) {
            console.log('Error-POST QRCODE', error.message);
            }
        }
        else{
            errorCorrectionTest.reportValidity()
        }

  }

    useEffect(() => {
        fetchData(pageNumber)
    }, [pageNumber, state])

    const fetchData = async (pageNumber: number) => {
        let limit = 10;
        let offset = pageNumber * limit
        let qrIds = qrIdRef ?.current ?.value == "" ? null : qrIdRef ?.current ?.value
        let createdByIds = createdByRef ?.current ?.value == "" ? null : createdByRef ?.current ?.value
        let startDate = startDateRef ?.current ?.value == "" ? null : startDateRef ?.current ?.value
        let endDate = endDateRef ?.current?.value == "" ? null : endDateRef ?.current ?.value
        let dateRangeVal = startDate == null || endDate == null ? null : `${startDate}~${endDate}`
        console.log(dateRangeVal)
        const params: any = {
            limit: limit,
            offset: offset,
            "filter.id": qrIds,
            "filter.createdBy": createdByIds,
            "filter.dateRange": dateRangeVal,

        }
        try{
        // const res = await axios.get(`http://localhost:5000/qr?limit=${limit}&offset=${offset}`)
        const res = await axios.get(`http://localhost:5000/qr`,{ params })
        setUrlData(res.data)}
        catch (error) {
            console.log('Error-POST QRCODE', error.message);
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
   
    return (
        <div>
            <form className={'ml-56 mt-4 mb-4'} ref={formRef}>
                <input
                    type="url"
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
                    onClick={modalHandler}
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
            <>
                {showFilterModal ? (
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
                                            <label>QRcode Ids:</label>
                                            <input
                                                type="text"
                                                name="QrIds"
                                                placeholder="Enter the url Uuids (',' separated)"
                                                className={
                                                    "rounded-lg h-[2.25rem] w-3/6  py-2.5 px-4 bg-gray-200  text-xs text-black font-semibold focus:bg-white border border-gray-200 mt-[.4375rem]"
                                                }
                                                ref={qrIdRef}

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
                                            onClick={() => setShowFilterModal(false)}
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
                                            Qrcode specifications
                  </h6>
                                    </div>
                                    {/*body*/}
                                    <div>
                                        <div className="relative p-6 flex-auto">
                                            <label>ErrorCorrectionLevel:</label>
                                            <input
                                                type="text"
                                                name="errorcorrection"
                                                placeholder="L,H,M"
                                                defaultValue={'M'}
                                                className={
                                                    "rounded-lg h-[2.25rem] w-3/6  py-2.5 px-4 bg-gray-200  text-xs text-black font-semibold focus:bg-white border border-gray-200 mt-[.4375rem]"
                                                }
                                                pattern="[A-Za-z]+"
                                                ref={errorRef}

                                            />
                                        </div>
                                        <div className="relative p-6 flex-auto">
                                            <label>Masking:</label>
                                            <input
                                                ref={maskRef}
                                                type="number"
                                                name="masking"
                                                placeholder="Enter integer 0-7"
                                                defaultValue={2}
                                                className={
                                                    "rounded-lg h-[2.25rem] w-3/6  py-2.5 px-4 bg-gray-200  text-xs text-black font-semibold focus:bg-white border border-gray-200 mt-[.4375rem]"
                                                }
                                            />
                                        </div>
                                        <div className="relative p-6 flex-auto">
                                            <label>QuiteZone:</label>
                                            <input
                                                ref={marginRef}
                                                type="number"
                                                name="quitezone"
                                                placeholder="Enter integer"
                                                defaultValue={4}
                                                className={
                                                    "rounded-lg h-[2.25rem] w-3/6  py-2.5 px-4 bg-gray-200  text-xs text-black font-semibold focus:bg-white border border-gray-200 mt-[.4375rem]"
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
                                            onClick={handleSubmit}
                                        >
                                            Submit
                  </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    </>
                ) : null}
            </>
            {urlData.length==0 &&<div className="font-semibold uppercase ml-[36rem]"> No available Qr codes </div>}
            <div className="relative overflow-x-auto  sm:rounded-lg mt-10">
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
                            <th><button className="w-16" onClick={() => { setShowFilterModal(true) }}><img
                                src={FilterIcon}
                                alt="filter"
                                // height={100}
                                // width={100}
                                className="h-[40px] w-[80px]"
                            ></img></button> </th>
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