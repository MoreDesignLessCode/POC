import React from "react";
import "./Overview.css";

export default function Overview() {
  return (
    <section className="overview mt-20 mx-auto max-w-[70.625rem] px-5">
      <h2 className="overview__title text-3xl font-bold">Overview</h2>
      <p className="overview__p1 font-semibold mt-5">
        Welcome to the Demo App! You can find  Qr code genrerator which generates Qr code for given
        GS1 and normal URLs.
        Rating App which helps to submit feedbacks and ratings for a given product.
      </p>
      <p className="overview__p2 mt-5">
        The Qrcode generator takes an input URL and provides option to compress or generate
        its copact version. You can generate Qrcodes corresponding to orginal, compressed and
        compact URLs 
      </p>
      <p className="overview__p3 mt-5">
        The Rating App allows you to create feedbacks for product and also rate them 
      </p>
      {/* <img
        className="overview__img mt-10 mx-auto"
        src="./images/overview.svg"
        alt="People using Procter and Gamble website"
        width={471}
        height={283}
        loading="lazy"
      /> */}
    </section>
  );
}
