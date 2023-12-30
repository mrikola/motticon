import { useState } from "react";
import { useNavigate } from "react-router";
import { post } from "../../services/ApiService";
import { getUserInfoFromJwt } from "../../utils/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const doLogin = () => {
    post("/login", { email, password }).then(async (resp) => {
      const jwt = await resp.text();
      if (jwt !== null) {
        localStorage.setItem("user", jwt);
        localStorage.setItem("userInfo", await getUserInfoFromJwt(jwt));
        navigate("/profile");
      }
    });
  };

  return (
    <>
      <input value={email} onChange={(event) => setEmail(event.target.value)} />
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <button onClick={() => doLogin()}>login</button>
    </>
  );
};

export default Login;
