import { useContext, useEffect, useMemo, useCallback, useState } from "react";
import { useParams } from "react-router";
import {
  Accordion,
  ButtonGroup,
  Col,
  Container,
  Row,
  ToggleButton,
} from "react-bootstrap";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import { get } from "../../services/ApiService";
import {
  Tournament,
  Draft,
  DraftPod,
  DraftPodStandingsRow,
  Match,
} from "../../types/Tournament";
import Loading from "../../components/general/Loading";
import BackButton from "../../components/general/BackButton";
import HelmetTitle from "../../components/general/HelmetTitle";
import StandingsTable from "../../components/tournament/StandingsTable";
import PodResultsView from "../../components/tournament/PodResultsView";

type PodWithDraft = {
  pod: DraftPod;
  draft: Draft;
  draftIndex: number;
};

type FinalStandingsViewMode = "standings" | "pods";

type PodData = {
  standings: DraftPodStandingsRow[];
  matches: Match[];
};

function FinalStandings() {
  const { tournamentId } = useParams();
  const user = useContext(UserInfoContext);
  const [tournament, setTournament] = useState<Tournament>();
  const [allPods, setAllPods] = useState<PodWithDraft[]>();
  const [expandedPodId, setExpandedPodId] = useState<string | null>(null);
  const [latestRoundNumber, setLatestRoundNumber] = useState<number>(0);
  const [viewMode, setViewMode] = useState<FinalStandingsViewMode>("standings");
  const [podDataCache, setPodDataCache] = useState<
    Map<number, PodData | "loading">
  >(new Map());

  useEffect(() => {
    if (user && tournamentId) {
      const fetchData = async () => {
        try {
          const [tournamentResp, recentRoundResp] = await Promise.all([
            get(`/tournament/${tournamentId}/drafts`),
            get(`/tournament/${tournamentId}/round/recent`).catch(() => null),
          ]);

          const tournamentData = (await tournamentResp.json()) as Tournament;
          setTournament(tournamentData);

          // Get all pods from all drafts
          const pods: PodWithDraft[] = [];
          const sortedDrafts = [...tournamentData.drafts].sort(
            (a, b) => a.draftNumber - b.draftNumber
          );
          sortedDrafts.forEach((draft, draftIndex) => {
            draft.pods.forEach((pod) => {
              pods.push({ pod, draft, draftIndex });
            });
          });
          setAllPods(pods);

          // Get latest round number for standings
          if (recentRoundResp) {
            const recentRound = await recentRoundResp.json();
            setLatestRoundNumber(recentRound.roundNumber ?? 0);
          }
        } catch (error) {
          console.error("Error fetching tournament data:", error);
        }
      };
      fetchData();
    }
  }, [tournamentId, user]);

  // Fetch pod data when accordion expands
  useEffect(() => {
    if (!expandedPodId || !allPods) return;

    const podId = Number(expandedPodId);
    if (isNaN(podId)) return;

    // Check if we already have the data or are loading it
    const cachedData = podDataCache.get(podId);
    if (cachedData && cachedData !== "loading") {
      return; // Already have data
    }

    if (cachedData === "loading") {
      return; // Already loading
    }

    // Mark as loading
    setPodDataCache((prev) => new Map(prev).set(podId, "loading"));

    // Fetch the data
    const fetchPodData = async () => {
      try {
        const [standingsResp, matchesResp] = await Promise.all([
          get(`/draft/pod/${podId}/standings`),
          get(`/draft/pod/${podId}/matches`),
        ]);
        const standingsData =
          (await standingsResp.json()) as DraftPodStandingsRow[];
        const matchesData = (await matchesResp.json()) as Match[];

        setPodDataCache((prev) =>
          new Map(prev).set(podId, {
            standings: standingsData,
            matches: matchesData,
          })
        );
      } catch (error) {
        console.error(`Error fetching pod ${podId} data:`, error);
        // Remove loading state on error
        setPodDataCache((prev) => {
          const newMap = new Map(prev);
          newMap.delete(podId);
          return newMap;
        });
      }
    };

    fetchPodData();
    // podDataCache is intentionally omitted from deps - we only want to fetch when expandedPodId changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedPodId, allPods]);

  // Group pods by draft for better organization
  const podsByDraft = useMemo(() => {
    if (!allPods) return {};
    return allPods.reduce((acc, podWithDraft) => {
      const draftKey = podWithDraft.draft.id;
      if (!acc[draftKey]) {
        acc[draftKey] = {
          draft: podWithDraft.draft,
          draftIndex: podWithDraft.draftIndex,
          pods: [],
        };
      }
      acc[draftKey].pods.push(podWithDraft);
      return acc;
    }, {} as Record<number, { draft: Draft; draftIndex: number; pods: PodWithDraft[] }>);
  }, [allPods]);

  const renderPodResults = useCallback(
    (podWithDraft: PodWithDraft, draftIndex: number) => {
      const podId = podWithDraft.pod.id;
      const cachedData = podDataCache.get(podId);

      if (!user || cachedData === "loading") {
        return <Loading />;
      }

      if (cachedData) {
        return (
          <PodResultsView
            pod={podWithDraft.pod}
            user={user}
            draftIndex={draftIndex}
            standings={cachedData.standings}
            matches={cachedData.matches}
          />
        );
      }

      return <Loading />;
    },
    [podDataCache, user]
  );

  if (!user || !tournament || !allPods) {
    return <Loading />;
  }

  return (
    <Container className="mt-3 my-md-4">
      <HelmetTitle titleText={`${tournament.name} - Final standings`} />
      <Row>
        <BackButton
          buttonText="Back to tournament"
          path={`/tournament/${tournamentId}`}
        />
        <Col xs={12}>
          <h1 className="display-1">{tournament.name}</h1>
          <h2 className="display-2">Final standings</h2>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={12}>
          <ButtonGroup className="w-100">
            <ToggleButton
              id="toggle-standings"
              type="radio"
              variant="outline-primary"
              name="view-mode"
              value="standings"
              checked={viewMode === "standings"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setViewMode(e.currentTarget.value as FinalStandingsViewMode)
              }
              className="flex-fill"
            >
              Final standings
            </ToggleButton>
            <ToggleButton
              id="toggle-pods"
              type="radio"
              variant="outline-primary"
              name="view-mode"
              value="pods"
              checked={viewMode === "pods"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setViewMode(e.currentTarget.value as FinalStandingsViewMode)
              }
              className="flex-fill"
            >
              Draft Pods
            </ToggleButton>
          </ButtonGroup>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          {viewMode === "standings" && latestRoundNumber > 0 && (
            <StandingsTable
              roundNumber={latestRoundNumber}
              tournamentId={Number(tournamentId)}
              user={user}
            />
          )}
          {viewMode === "pods" && (
            <Accordion
              activeKey={expandedPodId || undefined}
              onSelect={(eventKey) =>
                setExpandedPodId(
                  eventKey === expandedPodId ? null : (eventKey as string)
                )
              }
              flush
            >
              {Object.values(podsByDraft)
                .sort((a, b) => a.draftIndex - b.draftIndex)
                .map(({ draft, draftIndex, pods }) => {
                  const sortedPods = [...pods].sort(
                    (a, b) => a.pod.podNumber - b.pod.podNumber
                  );
                  return (
                    <div key={draft.id}>
                      <Row className="mb-2 mt-4">
                        <Col xs={12}>
                          <h3 className="display-4">Draft {draftIndex + 1}</h3>
                        </Col>
                      </Row>
                      {sortedPods.map((podWithDraft) => (
                        <Accordion.Item
                          eventKey={podWithDraft.pod.id.toString()}
                          key={podWithDraft.pod.id}
                        >
                          <Accordion.Header>
                            <h4>
                              Pod {podWithDraft.pod.podNumber},{" "}
                              {podWithDraft.pod.cube?.title}
                            </h4>
                          </Accordion.Header>
                          <Accordion.Body>
                            {renderPodResults(podWithDraft, draftIndex)}
                          </Accordion.Body>
                        </Accordion.Item>
                      ))}
                    </div>
                  );
                })}
            </Accordion>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default FinalStandings;
