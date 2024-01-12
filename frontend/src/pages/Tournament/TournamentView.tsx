import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import { get, post } from "../../services/ApiService";
import { Round, Tournament } from "../../types/Tournament";
import { Cube } from "../../types/Cube";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import { Col, Container, Row, Button } from "react-bootstrap";
import VerticallyCenteredModal from "../../components/general/VerticallyCenteredModal";
import {
  Box,
  BoxArrowInLeft,
  ListOl,
  CalendarEvent,
  XLg,
  TrophyFill,
  CheckSquare,
  CheckSquareFill,
} from "react-bootstrap-icons";
import dayjs from "dayjs";

const TournamentView = () => {
  const { tournamentId } = useParams();
  const user = useContext(UserInfoContext);
  const [activeTournament, setActiveTournament] = useState<Tournament>();
  const [cubes, setCubes] = useState<Cube[]>([]);
  const [tournamentStatus, setTournamentStatus] = useState<string>();
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [staff, setStaff] = useState<boolean>(false);
  const [ongoingRound, setOngoingRound] = useState<Round>();
  const [modal, setModal] = useState({
    show: false,
    heading: "",
    text: "",
    actionText: "",
    actionFunction: "",
  });

  const doEnroll = () => {
    post(`/tournament/${tournamentId}/enroll/${user?.id}`, {}).then(
      async (resp) => {
        // temporary solution that just checks boolean return (should be object with tournament info)
        const enrolled = await resp.text();
        if (enrolled) {
          setModal({
            ...modal,
            show: false,
          });
          setIsEnrolled(true);
        }
      }
    );
  };

  const doDrop = () => {
    post(`/tournament/${tournamentId}/drop/${user?.id}`, {}).then(
      async (resp) => {
        // temporary solution that just checks boolean return (should be object with tournament info)
        const dropped = await resp.text();
        if (dropped) {
          setModal({
            ...modal,
            show: false,
          });
          setIsEnrolled(false);
        }
      }
    );
  };

  function checkEnrolled(enrollment) {
    if (enrollment && enrollment.player.id === user?.id) {
      setIsEnrolled(true);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await get(
        `/user/${user?.id}/tournament/${tournamentId}`
      );
      // TODO types + view
      const { tournament, enrollment, preferences } = await response.json();
      sessionStorage.setItem("currentTournament", tournament.id);
      setActiveTournament(tournament);
      const now = dayjs();
      const tournyStartDate = dayjs(tournament.startDate);
      const tournyEndDate = dayjs(tournament.endDate);
      if (tournyEndDate.isBefore(now, "day")) {
        setTournamentStatus("past");
      } else if (tournyStartDate.isAfter(now, "day")) {
        setTournamentStatus("future");
      } else {
        setTournamentStatus("ongoing");
      }
      checkEnrolled(enrollment);
    };

    if (user) {
      fetchData();
    }
  }, [user, tournamentId]);

  // check if user is staff
  useEffect(() => {
    const fetchData = async () => {
      const response = await get(`/user/${user?.id}/staff`);
      const staffed = (await response.json()) as Tournament[];
      staffed.map((tournament) => {
        if (tournament.id === Number(tournamentId)) {
          setStaff(true);
        }
      });
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await get(`/tournament/${tournamentId}/round`);
      const round = (await response.json()) as Round;
      setOngoingRound(round);
    };
    if (user && tournamentStatus === "ongoing") {
      fetchData();
    }
  }, [user]);

  // get cubes for this tournament
  useEffect(() => {
    const fetchData = async () => {
      const resp = await get(`/tournament/${tournamentId}/cubes`);
      const tournamentCubes = (await resp.json()) as Cube[];
      setCubes(tournamentCubes);
    };
    fetchData();
  }, [tournamentId]);

  function showStandings(roundNumber: number) {
    // todo: add generating of multiple standings based on data
    return (
      <Row>
        <Col xs={12}>
          <Link to={`/tournament/${tournamentId}/standings/${roundNumber}`}>
            <Button variant="primary">
              <ListOl /> Standings round {roundNumber}
            </Button>
          </Link>
        </Col>
      </Row>
    );
  }

  function showGoToOngoing() {
    return (
      <Row>
        <Col xs={12}>
          <Link to={`/tournament/${tournamentId}/ongoing/`}>
            <Button variant="primary">
              <TrophyFill /> View ongoing
            </Button>
          </Link>
        </Col>
      </Row>
    );
  }

  function showOngoing() {
    const status = "Playing round " + ongoingRound?.roundNumber;
    return (
      <Row>
        <Col xs={12}>
          <p>Tournament status: {status}</p>
        </Col>
      </Row>
    );
  }

  function showStaffButton() {
    return (
      <Row>
        <Col xs={12}>
          <Link to={`/tournament/${tournamentId}/staff`}>
            <Button variant="primary">
              <ListOl /> Go to staff view
            </Button>
          </Link>
        </Col>
      </Row>
    );
  }

  function handleEnrollClick() {
    console.log("called handleEnrollClick");
    setModal({
      show: true,
      heading: "Confirm enrollment",
      text: "Are you sure you want to enroll to this tournament?",
      actionText: "Confirm enrollment",
      actionFunction: "doDrop()",
    });
  }

  function showEnroll() {
    return (
      <Row>
        <Col xs={12}>
          <h2>Enroll</h2>
          <p>Price: free</p>
          <p>Seats left: 8/8</p>
          <Button
            variant="primary"
            type="submit"
            onClick={() => handleEnrollClick()}
            disabled={isEnrolled}
          >
            {!isEnrolled ? (
              <>
                <CheckSquare /> Enroll
              </>
            ) : (
              <>
                <CheckSquareFill /> Enrolled
              </>
            )}
          </Button>
          {isEnrolled ? showDrop() : <></>}
        </Col>
      </Row>
    );
  }

  function handleDropClick() {
    console.log("called handleEnrollClick");
    // add similar functionality as handleEnrollClick() here
  }

  function showDrop() {
    // todo: add actual drop functionality
    return (
      <Row>
        <Col xs={12}>
          <Button
            variant="danger"
            type="submit"
            onClick={() => handleDropClick()}
          >
            <XLg /> Drop from tournament
          </Button>
        </Col>
      </Row>
    );
  }

  function testfunction() {
    console.log("clikced this");
  }

  if (activeTournament) {
    return (
      <Container className="mt-3 my-md-4">
        <Row>
          <Col xs={12}>
            <Link to={`/tournaments`}>
              <Button variant="primary">
                <BoxArrowInLeft /> Back to tournaments
              </Button>
            </Link>
          </Col>
          <Col xs={12}>
            <h1 className="display-1">{activeTournament.name}</h1>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <h2>Tournament info</h2>
          </Col>
          <Col xs={12}>
            <p>
              <CalendarEvent className="display-6" />{" "}
              {dayjs(activeTournament.startDate).format("DD/MM/YYYY")} –{" "}
              {dayjs(activeTournament.endDate).format("DD/MM/YYYY")}
            </p>
            <p>{activeTournament.description}</p>
            <p>Type: Draft</p>
          </Col>
        </Row>
        {(() => {
          if (cubes.length > 0) {
            return (
              <Row>
                <Col xs={12}>
                  <Link to={`/tournament/${tournamentId}/cubes/`}>
                    <Button variant="primary">
                      <Box /> View tournament cubes
                    </Button>
                  </Link>
                </Col>
              </Row>
            );
          }
          return <></>;
        })()}
        {isEnrolled && tournamentStatus === "ongoing" ? (
          showGoToOngoing()
        ) : (
          <></>
        )}
        {tournamentStatus === "future" ? showEnroll() : <></>}
        {staff ? showStaffButton() : <></>}
        {tournamentStatus != "future" ? showStandings(5) : <></>}
        <VerticallyCenteredModal
          show={modal.show}
          onHide={setModal({
            ...modal,
            show: false,
          })}
          heading={modal.heading}
          text={modal.text}
          actionText={modal.actionText}
          actionFunction={modal.actionFunction}
        />
      </Container>
    );
  } else {
    return <>no user lul</>;
  }
};

export default TournamentView;
