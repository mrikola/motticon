import {
  Col,
  Container,
  Row,
  ButtonGroup,
  ToggleButton,
} from "react-bootstrap";
import { useParams } from "react-router";
import { useContext, useEffect, useState } from "react";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import { get } from "../../services/ApiService";
import HelmetTitle from "../../components/general/HelmetTitle";
import BackButton from "../../components/general/BackButton";
import Loading from "../../components/general/Loading";
import { DraftPod, Tournament, Draft } from "../../types/Tournament";
import PodSeatsView from "../../components/tournament/PodSeatsView";
import PodResultsView from "../../components/tournament/PodResultsView";

type PodWithDraft = {
  pod: DraftPod;
  draft: Draft;
  draftIndex: number;
};

function DraftPods() {
  const { tournamentId } = useParams();
  const user = useContext(UserInfoContext);
  const [tournament, setTournament] = useState<Tournament>();
  const [userDraftPods, setUserDraftPods] = useState<PodWithDraft[]>();
  const [viewMode, setViewMode] = useState<"seats" | "results">("seats");

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const resp = await get(`/tournament/${tournamentId}/drafts`);
        const tourny = (await resp.json()) as Tournament;
        setTournament(tourny);
        const userPods: PodWithDraft[] = [];
        const sortedDrafts = tourny.drafts.sort(
          (a, b) => a.draftNumber - b.draftNumber
        );
        sortedDrafts.forEach((draft, draftIndex) => {
          for (const pod of draft.pods) {
            for (const seat of pod.seats) {
              if (seat.player?.id === user?.id) {
                userPods.push({ pod, draft, draftIndex });
                break; // Only add pod once per draft
              }
            }
          }
        });
        setUserDraftPods(userPods);
      };
      fetchData();
    }
  }, [tournamentId, user]);

  // Check if any draft is complete (status === "completed" or last round is done)
  const hasCompletedDrafts = userDraftPods?.some(
    (podWithDraft) => podWithDraft.draft.status === "completed"
  );

  if (user) {
    return (
      tournament &&
      userDraftPods && (
        <Container className="mt-3 my-md-4">
          <HelmetTitle titleText={tournament.name + " Draft Pods"} />
          <Row>
            <BackButton
              buttonText="Back to tournament"
              path={`/tournament/${tournamentId}`}
            />
            <h1 className="display-1">{tournament.name}</h1>
            <h2 className="display-2">My draft pods</h2>
          </Row>
          {hasCompletedDrafts && (
            <Row className="mb-3">
              <Col xs={12}>
                <ButtonGroup className="w-100">
                  <ToggleButton
                    id="toggle-seats"
                    type="radio"
                    variant="outline-primary"
                    name="view-mode"
                    value="seats"
                    checked={viewMode === "seats"}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setViewMode(e.currentTarget.value as "seats" | "results")
                    }
                    className="flex-fill"
                  >
                    Seats
                  </ToggleButton>
                  <ToggleButton
                    id="toggle-results"
                    type="radio"
                    variant="outline-primary"
                    name="view-mode"
                    value="results"
                    checked={viewMode === "results"}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setViewMode(e.currentTarget.value as "seats" | "results")
                    }
                    className="flex-fill"
                  >
                    Results
                  </ToggleButton>
                </ButtonGroup>
              </Col>
            </Row>
          )}
          <Row>
            {userDraftPods.map((podWithDraft) => {
              const { pod, draft, draftIndex } = podWithDraft;
              const isDraftComplete = draft.status === "completed";
              const showResults = viewMode === "results" && isDraftComplete;

              return (
                <div key={pod.id}>
                  {showResults ? (
                    <PodResultsView
                      pod={pod}
                      user={user}
                      draftIndex={draftIndex}
                    />
                  ) : (
                    <PodSeatsView
                      pod={pod}
                      user={user}
                      draftIndex={draftIndex}
                    />
                  )}
                </div>
              );
            })}
          </Row>
        </Container>
      )
    );
  } else {
    return <Loading />;
  }
}

export default DraftPods;
