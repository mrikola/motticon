import { useContext, useState, useEffect } from "react";
import { get, post, put } from "../../services/ApiService";
import { Cube, CubeSelection } from "../../types/Cube";
import { Container, Row, Form, Button, Col } from "react-bootstrap";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import CubeSelect from "./CubeSelect";
import { generatePriorityArray } from "../../utils/preferences";
import { useParams } from "react-router";
import Loading from "../general/Loading";
import { Tournament } from "../../types/Tournament";
import HelmetTitle from "../general/HelmetTitle";
import { toast } from "react-toastify";
import { Preference, UserCubePreference } from "../../types/User";
import BackButton from "../general/BackButton";

const UserCubePreferences = () => {
  const user = useContext(UserInfoContext);
  const { tournamentId } = useParams();
  const [tournament, setTournament] = useState<Tournament>();
  const [cubes, setCubes] = useState<Cube[]>([]);
  const [options, setOptions] = useState<CubeSelection[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<
    (CubeSelection | undefined)[]
  >([]);
  const [priorityArray, setPriorityArray] = useState<number[]>([]);

  const [previousSelections, setPreviousSelections] = useState<CubeSelection[]>(
    []
  );

  function addPreferences() {
    const preferences: UserCubePreference[] = [];
    if (user) {
      for (let i = 0; i < selectedOptions.length; ++i) {
        // check for value so that the "no preference" are not added
        if (selectedOptions[i]?.value) {
          preferences.push({
            playerId: user.id,
            tournamentId: Number(tournamentId),
            cubeId: Number(selectedOptions[i]?.value),
            points: priorityArray[i],
          });
        }
      }
    }
    // if 0 preferences selected (i.e. all are "no preference"), just reset preferences
    // mainly relevant if user has selected preferences previously, but then wants to unselect
    if (preferences.length === 0) {
      resetPreferences();
    } else {
      post(`/tournament/preferences`, preferences).then(async (_resp) => {
        const success = (await _resp.json()) as boolean;
        if (success) {
          toast.success("Preferences saved");
        } else {
          toast.error("Unable to save preferences");
        }
      });
    }
  }

  function resetPreferences() {
    const send = {
      playerId: user?.id,
      tournamentId: Number(tournamentId),
      cubeId: "",
      points: "",
    };
    // endpoint deletes all cube preferences for tournamentId & userId
    put(`/tournament/preferences/delete`, send).then(async (_resp) => {
      const success = (await _resp.json()) as boolean;
      if (success) {
        toast.success("Preferences reset");
      } else {
        toast.error("Unable to reset preferences");
      }
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      const resp = await get(`/tournament/${tournamentId}/cubes`);
      const cubes = (await resp.json()) as Cube[];
      setCubes(cubes);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const resp = await get(`/tournament/${tournamentId}`);
      const tourny = (await resp.json()) as Tournament;
      // setSelectedOptions(Array(tourny.preferencesRequired));
      setPriorityArray(generatePriorityArray(tourny.preferencesRequired));
      setTournament(tourny);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        // get existing preferences
        const resp = await get(
          `/tournament/${tournamentId}/preferences/${user?.id}`
        );
        const prefs = (await resp.json()) as Preference[];
        // sort existing preferences by point value for correct rendering of CubeSelects
        prefs.sort((a, b) => b.points - a.points);
        if (prefs.length > 0) {
          setSelectedOptions([]);
          const opts = [];
          for (let i = 0; i < prefs.length; ++i) {
            opts.push({
              key: prefs[i].cube.id.toString(),
              value: prefs[i].cube.id.toString(),
              displayText: prefs[i].cube.title,
              disabled: false,
            });
          }
          setPreviousSelections(opts);
          setSelectedOptions(opts);
        }
      };

      fetchData();
    }
  }, [user]);

  useEffect(() => {
    setOptions(
      cubes.map((cube) => ({
        key: String(cube.id),
        value: String(cube.id),
        displayText: cube.title,
        disabled: false,
      }))
    );
  }, [cubes]);

  const switchOption = (priority: number, newOption?: CubeSelection) => {
    setSelectedOptions([
      ...selectedOptions.slice(0, priority),
      newOption,
      ...selectedOptions.slice(priority + 1),
    ]);
  };

  const availableOptions = options.map((opt) => ({
    ...opt,
    disabled: Boolean(selectedOptions.find((so) => so?.key === opt.key)),
  }));

  return user &&
    cubes &&
    tournament &&
    priorityArray &&
    selectedOptions &&
    previousSelections ? (
    <Container className="mt-3 my-md-4">
      <HelmetTitle titleText={tournament.name + " – Cube Preferences"} />
      <Row>
        <BackButton
          buttonText="Back to tournament"
          path={`/tournament/${tournamentId}`}
        />
        <h1 className="display-1">{tournament.name}</h1>
        <h2>Your cube preferences</h2>
        <p>
          Please select the cubes that you would like to draft. If you don't
          care too much about what you draft, you can leave a preference
          unselected (i.e. so that it shows "No preference").
        </p>
        <p>
          Preference #1 will have a higher impact than #2 and so on, so if there
          is one cube you really want to draft, set it as preference #1.
        </p>
        <p>
          Preferences will be taken into account when making the draft pods, but
          we can't guarantee that you will get to draft the cubes you have
          selected.
        </p>
        <p>
          You can find information about the available cubes in the tournament's
          Cube section.
        </p>
        <p>
          You can change your preferences by selecting new cubes and
          resubmitting.
        </p>
      </Row>
      <Row xs={1} md={2}>
        <Form>
          <hr></hr>
          <h2>Select your preferences</h2>
          {priorityArray.map((e, i) => (
            <CubeSelect
              key={i}
              priority={i}
              pointValue={e}
              options={availableOptions}
              switchOption={switchOption}
              selectedOption={previousSelections[i]}
            />
          ))}
          <Col xs={12} className="my-3 d-grid">
            <Button
              variant="primary"
              className="btn-lg"
              onClick={addPreferences}
            >
              Submit preferences
            </Button>
          </Col>
        </Form>
      </Row>
      <Row></Row>
    </Container>
  ) : (
    <Loading />
  );
};

export default UserCubePreferences;
