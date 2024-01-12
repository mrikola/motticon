import { ChangeEvent } from "react";
import { Form } from "react-bootstrap";
import { CubeSelection } from "../../types/Cube";

type Props = {
  priority: number;
  options: CubeSelection[];
  pointValue: number;
  selectedOption?: CubeSelection;
  switchOption: (priority: number, newOption?: CubeSelection) => void;
};

const CubeSelect = ({ priority, options, switchOption }: Props) => {
  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const foo = e.target.value;
    const newOption = options.find((opt) => opt.key === foo);
    switchOption(priority, newOption);
  };

  return (
    <Form.Group className="mb-3" controlId={`CubePreference${priority}`}>
      <Form.Label>Cube preference #{priority + 1}</Form.Label>
      <Form.Select onChange={handleSelectChange}>
        <option>Select your preferred cube</option>
        {options.map((opt) => (
          <option key={opt.key} disabled={opt.disabled} value={opt.value}>
            {" "}
            {opt.displayText}{" "}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

export default CubeSelect;
