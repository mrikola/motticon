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
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {cubes.map((cube) => (
          <div className="col" key={cube.id}>
            <div className="card mb-3">
              <div className="row g-0">
                <div className="col-5 cube-card-image" style={{ backgroundImage: 'url(/img/masthead_'+cube.id+'.jpeg)' }}>
                </div>
                <div className="col-7">
                  <div className="card-body">
                    <h5 className="card-title">
                      {cube.title + ' '}
                      {cube.id == '1'? <i className="bi bi-exclamation-circle-fill text-primary"></i>: null }
                    </h5>
                    <p className="card-text">{cube.description}</p>
                    <p className="card-text"><small className="text-body-secondary">Designed by: Timo Tuuttari</small></p>
                    <Link to={`/cube/${cube.id}`} className="btn btn-primary">
                      <i className="bi bi-box"></i> Go to cube
                    </Link>
                  </div>
                </div>
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
