import { useEffect, useState } from "react";
import { get } from "../../services/ApiService";
import { useParams } from "react-router";
import { Cube } from "../../types/Cube";

const ViewCube = () => {
  const { cubeId } = useParams();

  const [cube, setCube] = useState<Cube>();

  useEffect(() => {
    const fetchData = async () => {
      const resp = await get(`/cube/${cubeId}`);
      const cube = (await resp.json()) as Cube;
      setCube(cube);
    };

    fetchData();
  }, []);

  if (cube) {
    return (
      <div className="container">
        <div className="row">
          <h1>This is cube: {cube.title}</h1>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <h2>Cube Designer: John Doe</h2>
            <a href={cube.url} target="_blank" className="btn btn-primary">
              Go to Cube Cobra
            </a>
          </div>
        </div>
      </div>
    );
  } else {
    return <>Loading...</>;
  }
};

export default ViewCube;
