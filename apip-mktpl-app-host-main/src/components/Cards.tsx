import React from "react";
import { Card } from "@procter-gamble/uxdl-react";
import { Link } from "react-router-dom";

export default function cards() {
  return (
    <section className="flex flex-col lg:flex-row justify-center gap-2.5 mt-16 mx-auto text-center">
      <Link to="/learn">
        <Card.Root
          rounded="small"
          className="mx-auto lg:m-0 h-full hover:text-blue-800"
        >
          <Card.Media>
            <img
              src="./images/compass.svg"
              alt="compass"
              className="h-[4.5625rem]"
            />
          </Card.Media>
          <Card.Title className="text-center text-base font-bold">
            Learn & Explore
          </Card.Title>
          <Card.Description className="text-black text-sm">
            Learn, Documentation and more
          </Card.Description>
        </Card.Root>
      </Link>
      <Link to="/discover">
        <Card.Root
          rounded="small"
          className="mx-auto lg:m-0 h-full hover:text-blue-800"
        >
          <Card.Media>
            <img
              src="./images/magnifying-glass.svg"
              alt="magnifying glass"
              className="h-[4.5rem]"
            />
          </Card.Media>
          <Card.Title className="text-center text-base font-bold">
            Discover
          </Card.Title>
          <Card.Description className="text-black text-sm">
            Search or Browse the existing library of APIs
          </Card.Description>
        </Card.Root>
      </Link>
      <Link to="/register">
        <Card.Root
          rounded="small"
          className="mx-auto lg:m-0 h-full hover:text-blue-800"
        >
          <Card.Media>
            <img src="./images/cog.svg" alt="cog" className="h-[4.625rem]" />
          </Card.Media>
          <Card.Title className="text-center text-base font-bold">
            Register
          </Card.Title>
          <Card.Description className="text-black text-sm">
            Are you owner of an API ? Please register and make it available.
          </Card.Description>
        </Card.Root>
      </Link>
    </section>
  );
}
