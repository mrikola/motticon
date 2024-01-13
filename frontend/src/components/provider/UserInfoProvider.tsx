import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { LoggedInUser } from "../../utils/auth";

export const UserInfoContext = React.createContext<LoggedInUser | null>(null);

const UserInfoProvider = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [value, setValue] = useState<LoggedInUser | null>(null);

  useEffect(() => {
    if (
      location.pathname !== "/login" &&
      location.pathname !== "/logout" &&
      location.pathname !== "/signup" &&
      localStorage.getItem("user") === null
    ) {
      navigate("/login", { replace: true });
    } else {
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo !== null) {
        setValue(JSON.parse(userInfo) as LoggedInUser);
      }
    }
  }, [location.pathname, navigate]);

  return (
    <UserInfoContext.Provider value={value}>
      <Outlet />
    </UserInfoContext.Provider>
  );
};

export default UserInfoProvider;
