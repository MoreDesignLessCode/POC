import React, { useEffect, useState } from "react";
import { Sidebar, Fab } from "@procter-gamble/uxdl-react";
import SidebarToggleIcon from "../../public/images/sidebar-toggle.svg";
import "./Sidebar.css";

export default function sidebar({ children }: any) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    document.querySelector(".layout").classList.contains("sidebar-closed") &&
      setSidebarOpen(false);
  }, []);

  return (
    <Sidebar.Root>
      <Sidebar.Trigger>
        <div
          tabIndex={0}
          onClick={() => setSidebarOpen((prev) => !prev)}
          onKeyDown={(e) =>
            e.key === "Enter" && setSidebarOpen((prev) => !prev)
          }
        >
          <Fab.Root className="h-[2.6rem] flex justify-center items-center border-[gray] z-10">
            <img
              src={SidebarToggleIcon}
              alt=""
              className={`${!sidebarOpen && "scale-[-1]"}`}
              height={14}
              width={14}
            />
          </Fab.Root>
        </div>
      </Sidebar.Trigger>
      {children}
    </Sidebar.Root>
  );
}
