import { Button, Col } from "react-bootstrap";
import { BoxArrowInLeft } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

type Props = {
  buttonText: string;
  path: string;
};

function BackButton({ buttonText, path }: Props) {
  return (
    <Col xs={12}>
      <Link to={path}>
        <Button variant="primary" className="icon-link">
          <BoxArrowInLeft /> {buttonText}
        </Button>
      </Link>
    </Col>
  );
}

export default BackButton;
