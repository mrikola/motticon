import { useEffect } from "react";
import { useNavigate } from "react-router";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("userInfo");
    navigate("/login");
  }, []);

  return <>Logging out...</>;
};

export default Logout;
