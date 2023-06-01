import React, { useEffect, useState } from "react";
import { useHostStore } from "host/store";
import { Link } from "react-router-dom";
import { Button } from "@coe/uxdl-react";
import Spinner from "./Spinner";
import BellIcon from "../../public/images/bell.svg";
import HeartIcon from "../../public/images/heart.svg";
import LogoutIcon from "../../public/images/logout.svg";

export default function UserDropdown() {
  const { user, login, logout } = useHostStore();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.addEventListener("click", ({ target }) => {
      !(target as Element).classList.contains("user") &&
        setUserDropdownOpen(false);
      setLoading(false);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(username, password);
    setLoading(true);
    setUsername("");
    setPassword("");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setUserDropdownOpen((prev) => !prev)}
        className="user user-dropdown__toggle"
      >
        <div className="user uxdl-header__end--user">
          <span className="user uxdl-header__end--username text-xs">
            {user.name ? user.name : "Login"}
          </span>
          {user.name && (
            <div className="user uxdl-header__end--avatar flex h-[36px] w-[36px] justify-center items-center rounded-[36px] bg-gray-200 text-xs text-blue-800">
              {user.name.split(" ")[0][0]}
              {user.name.split(" ")[1][0]}
            </div>
          )}
        </div>
      </button>
      {userDropdownOpen && (
        <div className="user user-dropdown absolute bg-white shadow-md top-[3.4375rem] right-[0] z-10 max-w-[15.625rem]">
          {user.name ? (
            <ul className="text-left">
              <li>
                <Link to="/subscribed-apis" tabIndex={0}>
                  <span className="text-xs font-medium flex items-center gap-x-1 py-3.5 px-7 hover:bg-gray-200 focus:bg-gray-200">
                    <img
                      src={BellIcon}
                      alt="notification bell"
                      height={24}
                      width={24}
                    />
                    Subscribed APIs
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/favorites-apis" tabIndex={0}>
                  <span className="text-xs font-medium flex items-center gap-x-1 py-3.5 px-7 hover:bg-gray-200">
                    <img src={HeartIcon} alt="heart" height={24} width={24} />
                    Favorite APIs
                  </span>
                </Link>
              </li>
              <li>
                <hr className="mx-5" />
              </li>
              <li>
                <span
                  tabIndex={0}
                  className="text-xs font-medium flex items-center gap-x-1 py-3.5 px-7 hover:bg-gray-200 cursor-pointer"
                  onClick={logout}
                >
                  <img src={LogoutIcon} alt="logout" height={24} width={24} />
                  Signout
                </span>
              </li>
            </ul>
          ) : (
            <div className="user pt-4 px-6 pb-6">
              <form className="user" onSubmit={handleSubmit}>
                <label className="user text-xs">
                  Username
                  <input
                    type="text"
                    value={username}
                    required
                    onChange={(evt) => setUsername(evt.target.value)}
                    className="user border text-xs border-gray-400 p-2 w-full rounded-lg"
                  />
                </label>
                <label className="user text-xs mt-2">
                  Password
                  <input
                    type="password"
                    value={password}
                    required
                    onChange={(evt) => setPassword(evt.target.value)}
                    className="user border text-xs border-gray-400 p-2 w-full rounded-lg"
                  />
                </label>
                <Button className="user uxdl-button--primary uxdl__border-radius--small text-xs py-2 px-9 mt-8 focus:outline-black">
                  {loading ? <Spinner /> : "Login"}
                </Button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
}
