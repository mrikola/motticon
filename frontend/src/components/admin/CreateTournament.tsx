import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import { useIsAdmin } from "../../utils/auth";
import Loading from "../general/Loading";
import { Controller, useForm } from "react-hook-form";
import { get, post } from "../../services/ApiService";
import { useNavigate } from "react-router";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import { Cube } from "../../types/Cube";

type TournamentForm = {
  name: string;
  description: string;
  players: number;
  drafts: number;
  startDate: Date;
  endDate: Date;
  cubeIds: number[];
};

const CreateTournament = () => {
  const user = useIsAdmin();
  const navigate = useNavigate();

  const [cubes, setCubes] = useState<Cube[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const resp = await get("/cube");
      const cubes = (await resp.json()) as Cube[];
      setCubes(cubes);
    };

    fetchData();
  }, []);

  const { control, register, handleSubmit } = useForm<TournamentForm>({
    defaultValues: {
      name: "",
      description: "",
      players: 8,
      drafts: 1,
      startDate: undefined,
      endDate: undefined,
      cubeIds: [],
    },
  });

  function doCreateTournament({
    name,
    description,
    players,
    drafts,
    startDate,
    endDate,
    cubeIds,
  }: TournamentForm) {
    console.log(
      "vormi",
      name,
      description,
      players,
      drafts,
      startDate,
      endDate,
      cubeIds
    );
    post("/tournament/create", {
      name,
      description,
      players,
      drafts,
      startDate,
      endDate,
      cubeIds,
    }).then(async (resp) => {
      const foo = await resp.text();
      console.log(foo);
      navigate("/admin");
    });
  }

  return user ? (
    <Container className="mt-3 my-md-4">
      <Row>
        <Col xs={12}>
          <h1 className="display-1">Create tournament</h1>
        </Col>
      </Row>
      <Row>
        <Form onSubmit={handleSubmit(doCreateTournament)}>
          <h2>General info</h2>
          <Col xs={12}>
            <FloatingLabel
              controlId="name"
              label="Tournament name"
              className="mb-3"
            >
              <Form.Control
                {...register("name")}
                type="text"
                placeholder="Tournament name"
              />
            </FloatingLabel>
          </Col>
          <Col xs={12}>
            <FloatingLabel
              controlId="description"
              label="Description"
              className="mb-3"
            >
              <Form.Control
                {...register("description")}
                type="text"
                placeholder="Description"
              />
            </FloatingLabel>
          </Col>
          <Row>
            <h2>Date</h2>
            <Col xs={6}>
              <Controller
                control={control}
                name="startDate"
                render={({ field }) => (
                  <DatePicker
                    placeholderText="Start date"
                    onChange={(date) => field.onChange(date)}
                    selected={field.value}
                    calendarClassName="bootstrap-calendar"
                    className="form-control mb-3"
                  />
                )}
              />
            </Col>
            <Col xs={6}>
              <Controller
                control={control}
                name="endDate"
                render={({ field }) => (
                  <DatePicker
                    placeholderText="End date"
                    onChange={(date) => field.onChange(date)}
                    selected={field.value}
                    calendarClassName="bootstrap-calendar"
                    className="form-control mb-3"
                  />
                )}
              />
            </Col>
          </Row>
          <Row>
            <h2>Tournament structure</h2>
            <Col xs={6}>
              <Form.Label>Player count</Form.Label>
              <Form.Select {...register("players")} className="mb-3">
                {[8, 16, 24, 32, 48, 64].map((count) => (
                  <option key={count} value={count}>
                    {count}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col xs={6}>
              <Form.Label>Drafts played</Form.Label>
              <Form.Select {...register("drafts")} className="mb-3">
                {[1, 2, 3, 4].map((count) => (
                  <option key={count} value={count}>
                    {count}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
          <Col xs={12}>
            <Form.Label>Cubes used</Form.Label>
            <Form.Select
              {...register("cubeIds")}
              htmlSize={cubes.length}
              multiple
              className="mb-3"
            >
              {cubes.map((cube) => (
                <option key={cube.id} value={cube.id}>
                  {cube.title}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col xs={12} className="d-grid">
            <Button variant="primary" type="submit" className="btn-lg">
              Create tournament
            </Button>
          </Col>
        </Form>
      </Row>
    </Container>
  ) : (
    <Loading />
  );
};

export default CreateTournament;
