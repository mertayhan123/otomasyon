"use client";
import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";

const Header = () => {
  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/login' }); // İsteğe bağlı olarak yönlendirme yapabilirsiniz
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    // sidebar'ın açık/kapalı durumunu değiştir
    setSidebarOpen(!sidebarOpen);
  };
  const { data: session } = useSession();
  console.log(session); 
  return (
    <div className="relative">
      <div
        className={`sidebar z-10 fixed top-0 left-0 w-64 h-full bg-gray-800 p-4 text-white transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0 z-10" : "-translate-x-full"
        }`}
      >
        <h2 className="text-2xl font-semibold mb-4">Bilesenler</h2>
        <ul>
          <li className="mb-2">
            <a href="/sensorler" className="text-white">
              Sensorler
            </a>
          </li>

          <li className="mb-2">
            <a href="/motorlar" className="text-white">
              Motorlar
            </a>
          </li>
        </ul>
      </div>
      <div
        className={`navbar bg-base-100 transition-transform duration-300 ${
          sidebarOpen ? "transform translate-x-64 " : ""
        }`}
      >
        <div className="flex-none">
          <button onClick={toggleSidebar} className="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-5 w-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
        <div className="flex-1">
          <a href="/main" className="btn btn-ghost text-xl">
            Otamasyon
          </a>
        </div>
        <div>
          {session ? (
            <a href="/main" className="btn btn-ghost">
              {session.user?.name}
            </a>
          ) : (
            <a href="/login" className="btn btn-ghost">
              Login
            </a>
          )}
        </div>
          
        
        <div className="flex-none">
          <label className="swap swap-rotate">
            <input
              type="checkbox"
              className="theme-controller"
              value="synthwave"
            />
            <svg
              className="swap-off h-10 w-10 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>

            {/* moon icon */}
            <svg
              className="swap-on h-10 w-10 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>
        </div>
        <button onClick={handleLogout} className="btn font-bold px-4 m-3 py-2 rounded">
      Logout
    </button>
      </div>
     
    </div>
  );
};

export default Header;
