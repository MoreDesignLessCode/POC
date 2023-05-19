import React from "react";
import { Footer } from "@procter-gamble/uxdl-react";
import { Link } from "react-router-dom";

export default function footer() {
  return (
    <Footer.Root variant="primary">
      <Footer.Start>
        <Link to="/" className="uxdl-header__start">
          <span className="uxdl-header__start--title text-sm font-normal">
            © 2023 Demo
          </span>
        </Link>
      </Footer.Start>
      <Footer.End>
        <ul className="uxdl-footer__end--links">
          <li>
            <a
              href=""
              className="text-sm font-normal"
            >
              Terms &amp; Conditions
            </a>
          </li>
          <li className="hidden lg:block">|</li>
          <li>
            <a
              href=""
              className="text-sm font-normal"
            >
              Privacy
            </a>
          </li>
        </ul>
      </Footer.End>
    </Footer.Root>
  );
}
