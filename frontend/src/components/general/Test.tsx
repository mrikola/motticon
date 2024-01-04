import { useState } from "react";
import { Button, Card, Col, Container, Row, Form, Select } from "react-bootstrap";


function Test() {

const [options, setOptions] = useState([
  {key: 1, value: 1, disabled: false},
  {key: 2, value: 2, disabled: false},
  {key: 3, value: 3, disabled: false}
]);

const handleChange = (e) => {
  const index = e.target.value;
  //handle the "click here" placeholder option
  if(index == 0) {
    return;
  }
 const optionsCopy = [...options];
   optionsCopy[index-1].disabled = true;
   setOptions(optionsCopy);
  }

  return (
    
      <Container>
      <Row>
        <Form.Group className="mb-3" controlId="CubePreference1">
          <Form.Label>Cube preference #1</Form.Label>
            <Form.Select onChange={handleChange}>
            <option value="0">Select your preferred cube</option>
            {options.map((opt) => (
              <option key={opt.key} disabled={opt.disabled} value={opt.key}> {opt.value} </option>
            ))} 
            </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="CubePreference2">
          <Form.Label>Cube preference #2</Form.Label>
            <Form.Select onChange={handleChange}>
            <option value="0">Select your preferred cube</option>
            {options.map((opt) => (
              <option key={opt.key} disabled={opt.disabled} value={opt.key}> {opt.value} </option>
            ))} 
            </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="CubePreference2">
          <Form.Label>Cube preference #3</Form.Label>
            <Form.Select onChange={handleChange}>
            <option value="0">Select your preferred cube</option>
            {options.map((opt) => (
              <option  key={opt.key} disabled={opt.disabled} value={opt.key}> {opt.value} </option>
            ))} 
            </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="CubePreference2">
          <Form.Label>Cube preference #4</Form.Label>
            <Form.Select onChange={handleChange}>
            <option value="0">Select your preferred cube</option>
            {options.map((opt) => (
              <option  key={opt.key} disabled={opt.disabled} value={opt.key}> {opt.value} </option>
            ))} 
            </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="CubePreference2">
          <Form.Label>Cube preference #5</Form.Label>
            <Form.Select onChange={handleChange}>
            <option value="0">Select your preferred cube</option>
            {options.map((opt) => (
              <option  key={opt.key} disabled={opt.disabled} value={opt.key}> {opt.value} </option>
            ))} 
            </Form.Select>
        </Form.Group>
      </Row>
      </Container>
  );
}

export default Test;
