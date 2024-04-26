import { BoxArrowUpRight } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { DraftPodSeat } from "../../types/Tournament";

type Props = {
  seat: DraftPodSeat;
};

function DraftPoolButton({ seat }: Props) {
  return (
    <Link
      to={seat.deckPhotoUrl}
      target="_blank"
      className="btn btn-primary btn-lg"
    >
      <BoxArrowUpRight /> View your draft pool
    </Link>
  );
}

export default DraftPoolButton;
