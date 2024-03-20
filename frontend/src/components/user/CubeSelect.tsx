import { ChangeEvent, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { CubeSelection } from "../../types/Cube";

type Props = {
  priority: number;
  options: CubeSelection[];
  pointValue: number;
  selectedOption?: CubeSelection;
  switchOption: (priority: number, newOption?: CubeSelection) => void;
};

const CubeSelect = ({
  priority,
  options,
  selectedOption,
  switchOption,
}: Props) => {
  const [currentSelection, setCurrentSelection] = useState<string>();
  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCurrentSelection(e.target.value);
    const foo = e.target.value;
    const newOption = options.find((opt) => opt.key === foo);
    if (newOption) {
      switchOption(priority, newOption);
    } else {
      const noPref = {
        key: "0",
        value: "0",
        displayText: "No preference",
        disabled: false,
      };
      switchOption(priority, noPref);
    }
  };

  useEffect(() => {
    if (selectedOption) {
      setCurrentSelection(selectedOption.value);
    }
  }, [selectedOption]);

  return (
    <Form.Group className="mb-3" controlId={`CubePreference${priority}`}>
      <Form.Label>Cube preference #{priority + 1}</Form.Label>
      <Form.Select onChange={handleSelectChange} value={currentSelection}>
        <option>Select your preferred cube</option>
        {options.map((opt) => (
          <option key={opt.key} disabled={opt.disabled} value={opt.value}>
            {" "}
            {opt.displayText}{" "}
          </option>
        ))}
        <option disabled={false} value={0}>
          No preference
        </option>
      </Form.Select>
    </Form.Group>
  );
};

export default CubeSelect;
