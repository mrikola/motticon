import { Button, Col, Row } from "react-bootstrap";
import { Draft, Match } from "../../types/Tournament";
import DecksSubmittedProgressBar from "./DecksSubmittedProgressBar";
import DecksSubmittedTable from "./DecksSubmittedTable";
import { useEffect, useState } from "react";
import { get } from "../../services/ApiService";

type Props = {
  currentDraft: Draft;
  placeholderId: number;
};

const ManageDraft = ({ currentDraft, placeholderId }: Props) => {
  // pure data placeholder
  const [matches, setMatches] = useState<Match[]>();
  useEffect(() => {
    const fetchData = async () => {
      const response = await get(`/match/round/${placeholderId}`);
      const mtchs = (await response.json()) as Match[];
      // sort by table number, descending
      mtchs.sort((a, b) => (a.tableNumber > b.tableNumber ? 1 : -1));
      setMatches(mtchs);
    };
    fetchData();
  }, []);

  if (matches) {
    return (
      <>
        <Row>
          <h2>Manage draft {currentDraft.id}</h2>
          <Col xs={12}>
            <DecksSubmittedProgressBar
              remainingSubmissions={1}
              totalPlayers={matches.length}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="d-grid">
            <Button variant="primary">Start round</Button>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col xs={12}>
            <DecksSubmittedTable players={matches} />
          </Col>
        </Row>
      </>
    );
  }
};

export default ManageDraft;
