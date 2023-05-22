import React, { useEffect, useRef, useState } from "react";
import { useUrlStore } from "../store";

import axios from "axios";

const QrcodeDetails: React.FC = () => {
    const [submit,setSubmit] =useState(false)
    const errorRef = useRef(null);
    const versionRef = useRef(null);
    const { urlData, setUrlData } = useUrlStore();
    const [state, setState] = useState('')
    const urlRef = useRef(null);
    const [pageNumber, setPageNumber] = useState<number>(0)

    const modalHandler =(event:any)=>{
        event.preventDefault();
        setShowModal(true)
    }

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        //setShowModal(true)
        const errorCorrectionLevel=errorRef.current.value
        const version=versionRef.current.value
       
        
        const params: any = {
            errorCorrectionLevel: errorCorrectionLevel,
            version:version,
        }
        if(urlRef.current.value!=''){
        const createRating = await axios.post('http://localhost:5000/qr',
            {
                location: urlRef ?.current ?.value
            },
            {params}
        )
        setState(createRating ?.data ?.location)
        setShowModal(false)
        }

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
    const [showModal, setShowModal] = useState(false)
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
                                                name="UrlIds"
                                                placeholder="L,H,M"
                                                className={
                                                    "rounded-lg h-[2.25rem] w-3/6  py-2.5 px-4 bg-gray-200  text-xs text-black font-semibold focus:bg-white border border-gray-200 mt-[.4375rem]"
                                                }
                                                ref={errorRef}

                                            />
                                        </div>
                                        <div className="relative p-6 flex-auto">
                                            <label>Version:</label>
                                            <input
                                                ref={versionRef}
                                                type="text"
                                                name="Createdby"
                                                placeholder="Enter integer"
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