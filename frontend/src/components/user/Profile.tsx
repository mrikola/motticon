import { useContext } from "react";
import { Link } from "react-router-dom";
import { get } from "../../services/ApiService";
import { UserInfoContext } from "../provider/UserInfoProvider";

const Profile = () => {
  const user = useContext(UserInfoContext);
  if (user) {
    return (
      <>
        this is you: {user.firstName} {user.lastName}
        <div>click these and watch the console</div>
        <div>
          <button type="button" className="btn btn-primary" 
            onClick={() =>
              get("/user/profile").then(async (resp) =>
                console.log(await resp.text())
              )
            }
          >
            do normal user shit
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => get("/admin")}>do admin shit</button>
        </div>
        <div>
          <button type="button" className="btn btn-danger" onClick={() => get("/logout")}>log me out</button>
          <Link style={{ color: "red" }} to={"/logout"}>
            log me out
          </Link>
        </div>
      </>
    );
  } else {
    return <>no user lul</>;
  }
};

export default Profile;
