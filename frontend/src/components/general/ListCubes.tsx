import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { get } from "../../services/ApiService";
import { Cube } from "../../types/Cube";
import { UserInfoContext } from "../provider/UserInfoProvider";

const Cubes = () => {
  const user = useContext(UserInfoContext);
  const [cubes, setCubes] = useState<Cube[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const resp = await get("/cube");
      const cubes = (await resp.json()) as Cube[];
      setCubes(cubes);
    };

    fetchData();
  }, []);

  if (user) {
    return (
      <div className="container">
        <div className="row">
          <h1>Cubes</h1>
        </div>
        <div className="row">
          {cubes.map((cube) => (
            <div className="col-sm-6" key={cube.id}>
              <div className="card">
                <svg
                  className="bd-placeholder-img card-img-top"
                  width="100%"
                  height="180"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="Placeholder: Image cap"
                  preserveAspectRatio="xMidYMid slice"
                  focusable="false"
                >
                  <title>Placeholder</title>
                  <rect width="100%" height="100%" fill="#868e96"></rect>
                  <text x="50%" y="50%" fill="#dee2e6" dy=".3em">
                    Image cap
                  </text>
                </svg>
                <div className="card-body">
                  <h5 className="card-title">{cube.title}</h5>
                  <p className="card-text">{cube.description}</p>
                  <Link to={`/cube/${cube.id}`} className="btn btn-primary">
                    Go to cube
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return <>no user lul</>;
  }
};

export default Cubes;
