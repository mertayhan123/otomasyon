"use client";
import React, { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";

const Header = () => {
  const [theme, setTheme] = useState("light");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      await signOut({ redirect: true, callbackUrl: "/login" });
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className="relative w-full">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-gray-900 text-white p-6 transition-transform duration-300 z-30 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h2 className="text-3xl font-bold mb-8 border-b pb-4">Components</h2>
        <ul className="space-y-6">
          <li>
            <a
              href="/sensorler"
              className="hover:text-indigo-400 transition-colors"
            >
              Sensors
            </a>
          </li>
          <li>
            <a
              href="/motorlar"
              className="hover:text-indigo-400 transition-colors"
            >
              Motors
            </a>
          </li>
          <li>
            <a href="/isi" className="hover:text-indigo-400 transition-colors">
              Isı Bilgileri
            </a>
          </li>
        </ul>
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 btn btn-circle btn-outline border-white text-white hover:bg-white hover:text-gray-900 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Navbar */}
      <div className="w-full">
        <nav className="navbar bg-base-100 shadow-md block top-0 left-0 w-full z-20 h-16 flex justify-between items-center px-6 transition-all">
          {/* Sidebar Toggle Button */}
          <div className="flex-none">
            <button
              onClick={toggleSidebar}
              className="btn btn-square btn-ghost text-2xl"
            >
              ☰
            </button>
          </div>

          {/* Center Title */}
          <div className="flex-1 text-center">
            {session ? (
              <a
                href="/main"
                className="text-2xl font-bold uppercase hover:text-indigo-600 transition-colors"
              >
                {session.user?.name}
              </a>
            ) : (
              <a href="/login" className="btn btn-ghost text-2xl">
                Automation
              </a>
            )}
          </div>

          {/* Right-side Buttons */}
          <div className="flex-none flex items-center space-x-6">
            {/* Theme Toggle */}
            <label className="swap swap-rotate">
              <input
                type="checkbox"
                className="hidden"
                checked={theme === "dark"}
                onChange={toggleTheme}
              />
              <svg
                className="swap-on fill-current w-8 h-8 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
              </svg>
              <svg
                className="swap-off fill-current w-8 h-8 text-gray-800"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.79,1.07,8.28,8.28,0,0,1-7.31-7.31,8.05,8.05,0,0,1,1.07-3.79A1,1,0,0,0,8.36,2.36,10.14,10.14,0,1,0,21.64,13Z" />
              </svg>
            </label>

            {/* Logout */}
            {session && (
              <button
                onClick={handleLogout}
                className="btn btn-sm btn-error font-semibold hover:scale-105 transition-transform"
              >
                Logout
              </button>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;
