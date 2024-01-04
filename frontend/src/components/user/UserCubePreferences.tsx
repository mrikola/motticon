import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, ExclamationCircleFill } from "react-bootstrap-icons";
import { get } from "../../services/ApiService";
import { Cube } from "../../types/Cube";
import { Button, Card, Col, Container, Row, Form, Select } from "react-bootstrap";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import styles from "./ListCubes.module.css";

const UserCubePreferences = () => {
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

  const [options, setOptions] = useState([]);
  useEffect(() => {
    setOptions(cubes.map((cube) => 
      ({
        key: cube.id,
        value: cube.id,
        displayText: cube.title + " – " + cube.description,
        disabled: false
      })
    ));
  }, [cubes]);

  const handleSelectChange = (e) => {
    const index = e.target.value;
    const optionsCopy = [...options];
    optionsCopy[index-1].disabled = true;
    setOptions(optionsCopy);
  }

  if (user) {
    return (
      <Container>
        <Row>
          <h1>Your cube preferences</h1>
          <p>Please select the cubes that you would most like to draft during the tournament. #1 is your most favorite, #2 the second most favorite and so on. If you don’t care too much about what you draft, select “No preference”.</p>
          <p>We can not guarantee that you will get to draft the cubes you have selected, but preferences will be taken into account when making the draft pods.</p>
          <p>You can find information about the available cubes in the “Cube” section.</p>
        </Row>
        <Row xs={1} sm={1} md={2}>
          <Form>
            <Form.Group className="mb-3" controlId="CubePreference1">
              <Form.Label>Cube preference #1</Form.Label>
              <Form.Select onChange={handleSelectChange}>
              <option>Select your preferred cube</option>
                {options.map((opt) => (
                  <option key={opt.key} disabled={opt.disabled} value={opt.value}> {opt.displayText} </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="CubePreference2">
              <Form.Label>Cube preference #2</Form.Label>
              <Form.Select onChange={handleSelectChange}>
              <option>Select your preferred cube</option>
                {options.map((opt) => (
                  <option key={opt.key} disabled={opt.disabled} value={opt.value}> {opt.displayText} </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="CubePreference3">
              <Form.Label>Cube preference #3</Form.Label>
              <Form.Select onChange={handleSelectChange}>
              <option>Select your preferred cube</option>
                {options.map((opt) => (
                  <option key={opt.key} disabled={opt.disabled} value={opt.value}> {opt.displayText} </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="CubePreference4">
              <Form.Label>Cube preference #4</Form.Label>
              <Form.Select onChange={handleSelectChange}>
              <option>Select your preferred cube</option>
                {options.map((opt) => (
                  <option key={opt.key} disabled={opt.disabled} value={opt.value}> {opt.displayText} </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="CubePreference5">
              <Form.Label>Cube preference #5</Form.Label>
              <Form.Select onChange={handleSelectChange}>
              <option>Select your preferred cube</option>
                {options.map((opt) => (
                  <option key={opt.key} disabled={opt.disabled} value={opt.value}> {opt.displayText} </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Row>
      </Container>
    );
  } else {
    return <>no user lul</>;
  }
};

export default UserCubePreferences;
