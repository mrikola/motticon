import { ButtonGroup, ToggleButton } from "react-bootstrap";

type Props = {
  name: string;
  value: string;
  updateFunction: (val: string) => void;
  disabled: boolean;
  variant: string;
};

function MatchResultsRadioButton({
  name,
  value,
  updateFunction,
  disabled,
  variant,
}: Props) {
  const radios = [
    { name: "0", value: "0" },
    { name: "1", value: "1" },
    { name: "2", value: "2" },
  ];

  return (
    <ButtonGroup className="result-entry-radio-group">
      {radios.map((radio, idx) => (
        <ToggleButton
          key={idx}
          size="lg"
          id={name + "-" + idx}
          type="radio"
          variant="result-entry-radio"
          name={name}
          value={radio.value}
          checked={value === radio.value}
          className={"result-entry-radio " + variant}
          onChange={(e) => updateFunction(e.currentTarget.value)}
          disabled={disabled}
        >
          {radio.name}
        </ToggleButton>
      ))}
    </ButtonGroup>
  );
}

export default MatchResultsRadioButton;
