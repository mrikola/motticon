import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { get } from "../../services/ApiService";
import { Col, Container, Row, Button } from "react-bootstrap";
import { BoxArrowInLeft } from "react-bootstrap-icons";
import dayjs from "dayjs";
import * as duration from "dayjs/plugin/duration";
dayjs.extend(duration);
import { Draft, Round } from "../../types/Tournament";
import { useIsTournamentStaff } from "../../utils/auth";
import Loading from "../../components/general/Loading";
import ManageRound from "../../components/staff/ManageRound";
import ManageDraft from "../../components/staff/ManageDraft";
import NextDraft from "../../components/staff/NextDraft";

function StaffView() {
  const { tournamentId } = useParams();
  const user = useIsTournamentStaff(Number(tournamentId));
  const [currentRound, setCurrentRound] = useState<Round>();
  const [currentDraft, setCurrentDraft] = useState<Draft>();

  useEffect(() => {
    const fetchData = async () => {
      const [roundResponse, draftResponse] = await Promise.all([
        get(`/tournament/${tournamentId}/round`),
        get(`/tournament/${tournamentId}/draft`),
      ]);
      if (Number(roundResponse.headers.get("content-length")) > 0) {
        const round = (await roundResponse.json()) as Round;
        const roundParsed: Round = {
          ...round,
          startTime: new Date(round.startTime),
        };
        setCurrentRound(roundParsed);
      }

      if (Number(draftResponse.headers.get("content-length")) > 0) {
        const draft = (await draftResponse.json()) as Draft;
        setCurrentDraft(draft);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  return user ? (
    <Container className="mt-3 my-md-4">
      <Col xs={12}>
        <Link to={`/tournament/${tournamentId}`}>
          <Button variant="primary">
            <BoxArrowInLeft /> Back to tournament
          </Button>
        </Link>
      </Col>
      <Row>
        <h1 className="display-1">
          Hey {user.firstName} {user.lastName}
        </h1>
      </Row>
      {currentRound && <ManageRound currentRound={currentRound} />}
      {!currentRound && currentDraft && (
        <ManageDraft currentDraft={currentDraft} />
      )}
      {!currentRound && !currentDraft && (
        <NextDraft
          tournamentId={Number(tournamentId)}
          setCurrentDraft={setCurrentDraft}
        />
      )}
    </Container>
  ) : (
    <Loading />
  );
}
export default StaffView;
