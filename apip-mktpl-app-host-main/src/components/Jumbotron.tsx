import React from "react";
import { Button, Alert } from "@procter-gamble/uxdl-react";
import "./Jumbotron.css";
import { Link } from "react-router-dom";

export default function Jumbotron() {
  return (
    <section className="jumbotron text-center">
      <div className="jumbotron__img bg-[url('../public/images/jumbotron.webp')] bg-[length:110%_110%] bg-[50%]" />
      <div className="jumbotron__content m-auto">
        <h1 className="text-4xl font-bold">Welcome to the Demo App</h1>
        <p className="mt-5 font-bold max-w-[490px] mx-auto">
          The Demo App  for QrCodes and Ratings!
        </p>
        <div className="mt-5 flex justify-center gap-x-2.5">
          {/* <Link to="/discover" tabIndex={-1}>
            <Button
              variant="primary"
              rounded="small"
              className="text-xs py-2 px-9 focus:outline-black"
            >
              Discover Now
            </Button>
          </Link> */}
          <Alert.Root>
            {/* <Alert.Trigger>
              <Button
                variant="primary"
                rounded="small"
                outline
                className="text-xs py-2 px-9 focus:outline-black bg-white"
              >
                Watch Video
              </Button>
            </Alert.Trigger> */}
            <Alert.Content rounded="large" className="w-[100%] max-w-[37.5rem]">
              <Alert.Title>What are APIs?</Alert.Title>
              <Alert.Description>
                <iframe
                  width="100%"
                  height="315"
                  src="https://www.youtube.com/embed/OVvTv9Hy91Q"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </Alert.Description>
              <Alert.Cancel>
                <Button
                  variant="primary"
                  rounded="small"
                  className="text-xs py-2 px-9 focus:outline-black"
                >
                  Close
                </Button>
              </Alert.Cancel>
            </Alert.Content>
            <Alert.Overlay />
          </Alert.Root>
        </div>
      </div>
    </section>
  );
}
