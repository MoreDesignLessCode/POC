import React from "react";
import { Link, useNavigate, createSearchParams } from "react-router-dom";
import UserDropdown from "./UserDropdown";
import PgLogoIcon from "../../public/images/pglogo.svg";
import SupportIcon from "../../public/images/support.svg";
import CirclePlusIcon from "../../public/images/circle-plus.svg";
import "./Header.css"

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
    // <Header.Root>
    //   <Header.Start className="mr-auto mx-4 lg:mr-0 lg:mx-0">
  
    //   </Header.Start>
     
    //   <Navbar.Root variant="primary">
    //     <Navbar.Item className="lg:hidden">
    //       <form onSubmit={handleSubmit}>
    //         <input
    //           type="search"
    //           placeholder="Search here.."
    //           className="uxdl-navbar__item lg:hidden rounded-lg h-[2.25rem] lg:w-[33.5rem] py-2.5 px-4 bg-gray-200 text-xs text-black font-semibold focus:bg-white border border-gray-200 mx-auto w-full"
    //         />
    //       </form>
    //     </Navbar.Item>
    //     <Navbar.Item>
    //       <Link to="/">Home</Link>
    //     </Navbar.Item>
    //     <Navbar.Item>
    //       <Link to="/feedback">Ratings</Link>
    //     </Navbar.Item>
    //     <Navbar.Item>
    //       <Link to="/qrcode">QRcode</Link>
    //     </Navbar.Item>
    //     <Navbar.Item>
    //       <Link to="/url">Url</Link>
    //     </Navbar.Item>
    //     <Navbar.Item className="lg:hidden">
    //       <hr />
    //     </Navbar.Item>
    //     <Navbar.Item className="lg:hidden">
    //       <Link to="/support" className="flex items-center gap-x-1">
    //         <span>Support</span>
    //         <img
    //           className="uxdl-header__end--icon"
    //           src={SupportIcon}
    //           alt="support call headphones"
    //           width={28}
    //           height={28}
    //         />
    //       </Link>
    //     </Navbar.Item>
    //   </Navbar.Root>
    // </Header.Root>


   
    <div className="domain-navbar">
    <div  className="navbar-container">
    <Link to='/' >
        <div className={`navbar-items`}>
            <p className="domain-nav-title">Home</p>
        </div>
    </Link>
    <Link to="/feedback" >
        <div className={`navbar-items`}>
            <p className="domain-nav-title">Rating</p>
        </div>
    </Link>
    <Link to="/qrcode" >
        <div className={`navbar-items`}>
            <p className="domain-nav-title">Qrcode</p>
        </div>
    </Link>
    <Link to="/url" >
        <div className={`navbar-items`}>
            <p className="domain-nav-title">Url</p>
        </div>
    </Link>
</div>
</div>
 
  );
}
