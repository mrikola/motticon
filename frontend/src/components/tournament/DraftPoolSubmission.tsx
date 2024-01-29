import { Button, Form, Row } from "react-bootstrap";
import { Image } from "react-bootstrap-icons";

function DraftPoolSubmission() {
  return (
    <Row>
      <h2>Draft pool submission</h2>
      <p>
        After the draft, please submit a photo showing all the cards you have
        drafted.
      </p>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Draft pool photo</Form.Label>
        <Form.Control type="file" />
      </Form.Group>
      <div className="d-grid gap-2">
        <Button variant="primary" className="btn-lg">
          <Image /> Submit pool photo
        </Button>
      </div>
    </Row>
  );
}

export default DraftPoolSubmission;
