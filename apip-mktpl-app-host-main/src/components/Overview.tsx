import React from "react";
import "./Overview.css";

export default function Overview() {
  return (
    <section className="overview mt-20 mx-auto max-w-[70.625rem] px-5">
      <h2 className="overview__title text-3xl font-bold">Overview</h2>
      <p className="overview__p1 font-semibold mt-5">
        Welcome to the P&G API Marketplace! Partners can find all the tools they
        need to begin the API integration process and access the API
        documentation.
      </p>
      <p className="overview__p2 mt-5">
        The API documentation provides partners with the tools and developer
        solutions to succeed with their customers. Access our comprehensive
        documentation to learn about the APIs.
      </p>
      <p className="overview__p3 mt-5">
        The API reference provides details about the endpoints, request/response
        structures, and sample codes.
      </p>
      <img
        className="overview__img mt-10 mx-auto"
        src="./images/overview.svg"
        alt="People using Procter and Gamble website"
        width={471}
        height={283}
        loading="lazy"
      />
    </section>
  );
}
