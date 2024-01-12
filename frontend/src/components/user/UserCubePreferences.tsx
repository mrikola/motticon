import { useContext, useState, useEffect } from "react";
import { get } from "../../services/ApiService";
import { Cube, CubeSelection } from "../../types/Cube";
import { Container, Row, Form } from "react-bootstrap";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import CubeSelect from "./CubeSelect";
import { generatePriorityArray } from "../../utils/preferences";
import { useParams } from "react-router";

const PREFERENCES_TO_SELECT = 5;

const UserCubePreferences = () => {
  const user = useContext(UserInfoContext);
  const { tournamentId } = useParams();
  const [cubes, setCubes] = useState<Cube[]>([]);
  const [options, setOptions] = useState<CubeSelection[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<
    (CubeSelection | undefined)[]
  >(Array(PREFERENCES_TO_SELECT));

  useEffect(() => {
    const fetchData = async () => {
      const resp = await get(`/tournament/${tournamentId}/cubes`);
      const cubes = (await resp.json()) as Cube[];
      setCubes(cubes);
    };

    fetchData();
  }, []);

  useEffect(() => {
    setOptions(
      cubes.map((cube) => ({
        key: String(cube.id),
        value: String(cube.id),
        displayText: cube.title + " – " + cube.description,
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

  const priorityArray = generatePriorityArray(PREFERENCES_TO_SELECT);

  if (user) {
    return (
      <Container className="mt-3 my-md-4">
        <Row>
          <h1>Your cube preferences</h1>
          <p>
            Please select the cubes that you would most like to draft during the
            tournament. #1 is your most favorite, #2 the second most favorite
            and so on. If you don’t care too much about what you draft, select
            “No preference”.
          </p>
          <p>
            We can not guarantee that you will get to draft the cubes you have
            selected, but preferences will be taken into account when making the
            draft pods.
          </p>
          <p>
            You can find information about the available cubes in the “Cube”
            section.
          </p>
        </Row>
        <Row xs={1} sm={1} md={2}>
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
          </Form>
        </Row>
      </Container>
    );
  } else {
    return <>no user lul</>;
  }
};

export default UserCubePreferences;
