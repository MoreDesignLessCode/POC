import React from "react";

export default function Modal({showModal,setShowModal}:any) {
  return (
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
                    name="Url"
                    placeholder="Enter the url Uuids (',' separated)"
                    className={
                        "rounded-lg h-[2.25rem] w-3/6  py-2.5 px-4 bg-gray-200  text-xs text-black font-semibold focus:bg-white border border-gray-200 mt-[.4375rem]"
                    }
                
                />
                </div>
                <div className="relative p-6 flex-auto">
                 <label>Created By Ids:</label>
                <input
                    type="url"
                    name="Url"
                    placeholder="Enter the url"
                    className={
                        "rounded-lg h-[2.25rem] w-3/6  py-2.5 px-4 bg-gray-200  text-xs text-black font-semibold focus:bg-white border border-gray-200 mt-[.4375rem]"
                    }
                />
                </div>
                <div className="relative p-6 flex-auto">
                 <label>Date Range:</label>
                <input
                    type="url"
                    name="Url"
                    placeholder="Enter the url"
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
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}