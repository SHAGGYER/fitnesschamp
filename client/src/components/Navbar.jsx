import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../AppContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AppContext);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-5xl mx-auto">
        <div className={`flex justify-between flex-col lg:flex-row`}>
          <div className="flex space-x-4 items-center p-2 lg:p-4">
            <i
              className="fa-solid fa-bars fa-2x cursor-pointer lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
            ></i>
            <span className="font-semibold">FitnessChamp</span>
          </div>
          <div className={`${isOpen ? "block" : "hidden"} lg:block`}>
            <ul className="flex flex-col lg:flex-row p-2 lg:p-4 gap-2">
              {!user && (
                <>
                  <li
                    className="cursor-pointer"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </li>
                  <li
                    className="cursor-pointer"
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </li>
                </>
              )}
              {user && (
                <>
                  <li className="cursor-pointer" onClick={() => navigate("/")}>
                    Workouts
                  </li>
                  <li
                    className="cursor-pointer"
                    onClick={() => navigate("/records")}
                  >
                    Records
                  </li>
                  <li className="cursor-pointer" onClick={logout}>
                    Logout
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
