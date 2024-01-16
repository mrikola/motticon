import { ButtonGroup, ToggleButton } from "react-bootstrap";

type Props = {
  name: string;
  value: string;
  updateFunction: (val: string) => void;
};

function MatchResultsRadioButton({ name, value, updateFunction }: Props) {
  const radios = [
    { name: "0", value: "0" },
    { name: "1", value: "1" },
    { name: "2", value: "2" },
  ];

  return (
    <ButtonGroup className="round-radio-group">
      {radios.map((radio, idx) => (
        <ToggleButton
          key={idx}
          size="lg"
          id={name + "-" + idx}
          type="radio"
          variant="round-radio"
          name={name}
          value={radio.value}
          checked={value === radio.value}
          className="round-radio"
          onChange={(e) => updateFunction(e.currentTarget.value)}
        >
          {radio.name}
        </ToggleButton>
      ))}
    </ButtonGroup>
  );
}

export default MatchResultsRadioButton;
