import React from "react";
import { Link, useNavigate, createSearchParams } from "react-router-dom";
import { Header, Navbar } from "@procter-gamble/uxdl-react";
import UserDropdown from "./UserDropdown";
import PgLogoIcon from "../../public/images/pglogo.svg";
import SupportIcon from "../../public/images/support.svg";
import CirclePlusIcon from "../../public/images/circle-plus.svg";
import "@procter-gamble/uxdl-react/default.css";

export default function header() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = (e.target as HTMLElement).children[0] as HTMLInputElement;

    document.body.classList.remove("nav-open");

    navigate({
      pathname: "search",
      search: createSearchParams({
        q: input.value,
      }).toString(),
    });
  };

  return (
    <Header.Root>
      <Header.Start className="mr-auto mx-4 lg:mr-0 lg:mx-0">
        <Link to="/">
          <img
            src={PgLogoIcon}
            alt="Procter and Gamble logo"
            className="uxdl-header__start--logo"
            width={45}
            height={45}
          />
        </Link>
      </Header.Start>
      <Header.Middle className="flex gap-6">
        {/* <form onSubmit={handleSubmit}>
          <input
            id="search"
            type="search"
            placeholder="Search here.."
            className="hidden lg:block rounded-lg h-[2.25rem] lg:w-[33.5rem] py-2.5 px-4 bg-gray-200 text-xs text-black font-semibold focus:bg-white border border-gray-200"
          />
        </form> */}
        <div className="flex flex-end gap-[1.25rem] font-semibold items-center justify-center">
          <Link
            // to="/support"
            to="/feedback"
            className="hidden lg:inline-flex uxdl-header__end--link flex items-center gap-x-1"
          >
            <img
              className="uxdl-header__end--icon invert opacity-50"
              src={SupportIcon}
              alt="support call headphones"
              width={28}
              height={28}
            />
            <span className="text-xs">Support</span>
          </Link>
          {/* <span className="hidden lg:inline-flex text-gray-400">|</span> */}
          {/* <UserDropdown /> */}
        </div>
      </Header.Middle>
      <Navbar.Root variant="primary">
        <Navbar.Item className="lg:hidden">
          <form onSubmit={handleSubmit}>
            <input
              type="search"
              placeholder="Search here.."
              className="uxdl-navbar__item lg:hidden rounded-lg h-[2.25rem] lg:w-[33.5rem] py-2.5 px-4 bg-gray-200 text-xs text-black font-semibold focus:bg-white border border-gray-200 mx-auto w-full"
            />
          </form>
        </Navbar.Item>
        <Navbar.Item>
          <Link to="/">Home</Link>
        </Navbar.Item>
        <Navbar.Item>
          <Link to="/feedback">Ratings</Link>
        </Navbar.Item>
        <Navbar.Item>
          <Link to="/qrcode">QRcode</Link>
        </Navbar.Item>
        <Navbar.Item>
          <Link to="/url">Url</Link>
        </Navbar.Item>
        {/* <Navbar.Item className="ml-auto">
          <Link to="/register" className="flex items-center gap-x-1">
            <span className="lg:order-2">Register API</span>
            <img
              className="lg:order-1"
              src={CirclePlusIcon}
              alt="plus sign"
              width={24}
              height={24}
            />
          </Link>
        </Navbar.Item> */}
        <Navbar.Item className="lg:hidden">
          <hr />
        </Navbar.Item>
        <Navbar.Item className="lg:hidden">
          <Link to="/support" className="flex items-center gap-x-1">
            <span>Support</span>
            <img
              className="uxdl-header__end--icon"
              src={SupportIcon}
              alt="support call headphones"
              width={28}
              height={28}
            />
          </Link>
        </Navbar.Item>
      </Navbar.Root>
    </Header.Root>
  );
}
