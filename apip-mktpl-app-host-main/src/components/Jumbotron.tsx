import React from "react";
import "./Jumbotron.css";

export default function Jumbotron() {
  return (
    <section className="jumbotron text-center">
      <div className="jumbotron__img bg-[url('../public/images/jumbotron.webp')] bg-[length:110%_110%] bg-[50%]" />
      <div className="jumbotron__content m-auto">
        <h1 className="text-4xl font-bold">Welcome to the Demo App</h1>
        <p className="mt-5 font-bold max-w-[490px] mx-auto">
          The Demo App  for QrCodes and Ratings!
        </p>
      </div>
    </section>
  );
}
