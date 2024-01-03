import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import DeckImage from "/img/draft_pool.png";
import { Cube } from "../../types/Cube";
import { get } from "../../services/ApiService";

const ViewCube = () => {
  const { cubeId } = useParams();
  const ImageURL = `/img/masthead_${cubeId}.jpeg`;

  const [cube, setCube] = useState<Cube>();

  useEffect(() => {
    const fetchData = async () => {
      const resp = await get(`/cube/${cubeId}`);
      const cube = (await resp.json()) as Cube;
      setCube(cube);
    };

    fetchData();
  }, []);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  if (cube) {
    return (
      <>
        <div
          className="cube-masthead text-light"
          style={{ backgroundImage: `url(${ImageURL})` }}
        >
          <div
            className="mask"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
          >
            <div className="container h-100">
              <div className="row h-100 align-items-center">
                <div className="col-12 text-center">
                  <h1>{cube.title}</h1>
                  <p className="lead"><i className="bi bi-pen-fill text-primary"></i> Cube Designer: John Doe</p>
                  <p>{cube.description}</p>
                  <a
                    href={cube.url}
                    target="_blank"
                    className="btn btn-primary"
                  >
                    <i className="bi bi-list"></i> View list on Cube Cobra
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div class="row">
            <h3>Draft 1</h3>
          </div>
          <div className="row">
            <div className="col-8 col-xs-8">
              <p>Player Name 1</p>
              <p>Player Name 2</p>
              <p>Player Name 3</p>
              <p>Player Name 4</p>
              <p>Player Name 5</p>
              <p>Player Name 6</p>
              <p>Player Name 7</p>
              <p>Player Name 1</p>
            </div>
            <div className="col-4 col-xs-4">
              <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleShow}
                >
                <i className="bi bi-image"></i>
              </button>
            </div>
          </div>
          <div class="row">
            <h3>Draft 2</h3>
          </div>
          <div className="row">
            <div className="col-8 col-xs-8">
              <p>Player Name 1</p>
              <p>Player Name 2</p>
              <p>Player Name 3</p>
              <p>Player Name 4</p>
              <p>Player Name 5</p>
              <p>Player Name 6</p>
              <p>Player Name 7</p>
              <p>Player Name 1</p>
            </div>
            <div className="col-4 col-xs-4">
              <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleShow}
                >
                <i className="bi bi-image"></i>
              </button>
            </div>
          </div>
          <div class="row">
            <h3>Draft 3</h3>
          </div>
          <div className="row">
            <div className="col-8 col-xs-8">
              <p>Player Name 1</p>
              <p>Player Name 2</p>
              <p>Player Name 3</p>
              <p>Player Name 4</p>
              <p>Player Name 5</p>
              <p>Player Name 6</p>
              <p>Player Name 7</p>
              <p>Player Name 1</p>
            </div>
            <div className="col-4 col-xs-4">
              <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleShow}
                >
                <i className="bi bi-image"></i>
              </button>
            </div>
          </div>
        </div>

        <Modal show={show} onHide={handleClose} fullscreen={true}>
          <Modal.Header closeButton>
            <Modal.Title>Cube Name – Draft Number – Player Name</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img src={DeckImage} className="img-fluid" />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  } else {
    return <>Loading</>;
  }
};

export default ViewCube;
