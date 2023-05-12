import React from "react";
import { Card } from "@procter-gamble/uxdl-react";

export default function GetStarted() {
  return (
    <section className="mt-16 py-14 mx-auto text-center bg-[url('../public/images/get-started.webp')] bg-contain">
      <h2 className="text-3xl font-bold">How to get started</h2>
      <p className="font-medium mt-5 max-w-[28.125rem] mx-auto">
        Resources and guides to help you through every step of the development
        journey.
      </p>
      <div className="flex flex-col lg:flex-row justify-center mt-10 gap-2.5">
        <Card.Root rounded="small" className="bg-white mx-auto lg:m-0">
          <Card.Media>
            <img
              src="./images/discover.png"
              alt="magnifying glass"
              className="h-[7.5rem] max-w-[7.5rem] mx-auto"
              loading="lazy"
            />
          </Card.Media>
          <Card.Title className="text-center text-base font-bold">
            Discover APIs
          </Card.Title>
          <Card.Description className="text-sm">
            Search or Browse the existing library of APIs
          </Card.Description>
        </Card.Root>
        <Card.Root rounded="small" className="bg-white mx-auto lg:m-0">
          <Card.Media>
            <img
              src="./images/register.png"
              alt="cog"
              className="h-[7.5rem] max-w-[7.5rem] mx-auto"
              loading="lazy"
            />
          </Card.Media>
          <Card.Title className="text-center text-base font-bold">
            Register
          </Card.Title>
          <Card.Description className="text-sm">
            Register and make it available for yourself and others !
          </Card.Description>
        </Card.Root>
        <Card.Root rounded="small" className="bg-white mx-auto lg:m-0">
          <Card.Media>
            <img
              src="./images/integrate.png"
              alt="website"
              className="h-[7.5rem] max-w-[7.5rem] mx-auto"
              loading="lazy"
            />
          </Card.Media>
          <Card.Title className="text-center text-base font-bold">
            Integrate
          </Card.Title>
          <Card.Description className="text-sm">
            Let us create modern scalable applications using the APIs !
          </Card.Description>
        </Card.Root>
      </div>
    </section>
  );
}
