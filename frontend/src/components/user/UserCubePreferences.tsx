import { useContext, useState, useEffect } from "react";
import { get, post } from "../../services/ApiService";
import { Cube, CubeSelection } from "../../types/Cube";
import { Container, Row, Form, Button } from "react-bootstrap";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import CubeSelect from "./CubeSelect";
import { generatePriorityArray } from "../../utils/preferences";
import { useParams } from "react-router";
import Loading from "../general/Loading";
import { Tournament } from "../../types/Tournament";
import HelmetTitle from "../general/HelmetTitle";
import { toast } from "react-toastify";
import { Preference, UserCubePreference } from "../../types/User";

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

  function addPreferences() {
    const preferences: UserCubePreference[] = [];
    if (user) {
      for (let i = 0; i < selectedOptions.length; ++i) {
        preferences.push({
          playerId: user.id,
          tournamentId: Number(tournamentId),
          cubeId: Number(selectedOptions[i]?.value),
          points: i,
        });
      }
    }
    post(`/cubePreferences`, preferences).then(async (_resp) => {
      // TODO show some kind of success thing
      const success = (await _resp.json()) as boolean;
      console.log(success);
      if (success) {
        toast.success("Preferences saved");
      } else {
        toast.error("Unable to save preferences");
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
      setSelectedOptions(Array(tourny.preferencesRequired));
      setPriorityArray(generatePriorityArray(tourny.preferencesRequired));
      setTournament(tourny);
    };
    fetchData();
  }, []);

  // for testing
  useEffect(() => {
    const fetchData = async () => {
      const resp = await get(`/tournament/${tournamentId}/preferences`);
      const prefs = (await resp.json()) as Preference[];
      console.log(prefs);
    };
    fetchData();
  }, []);

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

  return user && cubes && tournament && priorityArray ? (
    <Container className="mt-3 my-md-4">
      <HelmetTitle titleText={tournament.name + " – Cube Preferences"} />
      <Row>
        <h1 className="display-1">Your cube preferences</h1>
        <h2>{tournament.name}</h2>
        <p>
          Please select the cubes that you would like to draft. If you don't
          care too much about what you draft, select “No preference”.
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
      </Row>
      <Row xs={1} md={2}>
        <Form>
          {priorityArray.map((e, i) => (
            <CubeSelect
              key={i}
              priority={i}
              pointValue={e}
              options={availableOptions}
              switchOption={switchOption}
            />
          ))}
          <Button variant="primary" className="btn-lg" onClick={addPreferences}>
            Submit preferences
          </Button>
        </Form>
      </Row>
    </Container>
  ) : (
    <Loading />
  );
};

export default UserCubePreferences;
