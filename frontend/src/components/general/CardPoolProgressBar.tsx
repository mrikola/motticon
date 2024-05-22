import { ProgressBar } from "react-bootstrap";

type Props = {
  cardsAdded: number;
  cardsNeeded: number;
};

function CardPoolProgressBar({ cardsAdded, cardsNeeded }: Props) {
  return (
    <>
      <ProgressBar
        striped
        variant="primary"
        now={(cardsAdded / cardsNeeded) * 100}
        label={`${cardsAdded}/${cardsNeeded} cards`}
      />

      {cardsNeeded - cardsAdded != 0 ? (
        <p className="lead text-center">
          {cardsNeeded - cardsAdded} cards still needed
        </p>
      ) : (
        <p className="lead text-center">All cards added, you can submit</p>
      )}
    </>
  );
}

export default CardPoolProgressBar;
