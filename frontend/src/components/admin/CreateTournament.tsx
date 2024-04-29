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
import { Tournament } from "../../types/Tournament";
import HelmetTitle from "../general/HelmetTitle";
import BackButton from "../general/BackButton";
import { toast } from "react-toastify";

type TournamentForm = {
  name: string;
  description: string;
  price: number;
  players: number;
  drafts: number;
  preferencesRequired: number;
  startDate: Date;
  endDate: Date;
  cubeIds: number[];
  userEnrollmentEnabled: boolean;
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

  const {
    control,
    register,
    handleSubmit,
    getFieldState,
    formState: { errors },
  } = useForm<TournamentForm>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      players: 8,
      drafts: 1,
      preferencesRequired: 0,
      startDate: undefined,
      endDate: undefined,
      cubeIds: [],
      userEnrollmentEnabled: true,
    },
  });

  function doCreateTournament(form: TournamentForm) {
    post("/tournament/create", form).then(async (resp) => {
      const tournament = (await resp.json()) as Tournament;
      toast.success("Tournament created");
      navigate("/tournament/" + tournament.id);
    });
  }

  return user ? (
    <Container className="mt-3 my-md-4">
      <HelmetTitle titleText="Create Tournament" />
      <Row>
        <BackButton buttonText="Back to admin" path="/admin" />
        <Col xs={12}>
          <h1 className="display-1">Create tournament</h1>
        </Col>
      </Row>
      <Row>
        <Form noValidate onSubmit={handleSubmit(doCreateTournament)}>
          <h2>General info</h2>
          <Col xs={12}>
            <FloatingLabel
              controlId="name"
              label="Tournament name"
              className="mb-3"
            >
              <Form.Control
                {...register("name", {
                  required: "Please enter a tournament name",
                })}
                type="text"
                placeholder="Tournament name"
                className={
                  getFieldState("name").isDirty
                    ? getFieldState("name").invalid
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }
              />
              <p className="text-danger">
                {errors.name && errors.name.message}
              </p>
            </FloatingLabel>
          </Col>
          <Col xs={12}>
            <FloatingLabel
              controlId="description"
              label="Description"
              className="mb-3"
            >
              <Form.Control
                {...register("description", {
                  required: "Please enter a tournament description",
                })}
                type="text"
                placeholder="Description"
                className={
                  getFieldState("description").isDirty
                    ? getFieldState("description").invalid
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }
              />
              <p className="text-danger">
                {errors.description && errors.description.message}
              </p>
            </FloatingLabel>
          </Col>
          <Col xs={12}>
            <FloatingLabel
              controlId="price"
              label="Price (in €)"
              className="mb-3"
            >
              <Form.Control
                {...register("price", {
                  required: "Please enter the price as a number",
                })}
                type="number"
                placeholder="0"
                className={
                  getFieldState("price").isDirty
                    ? getFieldState("price").invalid
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }
              />
              <p className="text-danger">
                {errors.price && errors.price.message}
              </p>
            </FloatingLabel>
          </Col>
          <Row>
            <h2>Date</h2>
            <Col xs={6}>
              <Controller
                control={control}
                name="startDate"
                rules={{
                  required: "Enter a start date",
                }}
                render={({ field }) => (
                  <DatePicker
                    placeholderText="Start date"
                    onChange={(date) => field.onChange(date)}
                    selected={field.value}
                    calendarClassName="bootstrap-calendar"
                    className={`form-control mb-3
                      ${
                        getFieldState("startDate").isDirty
                          ? getFieldState("startDate").invalid
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    calendarStartDay={1}
                  />
                )}
              />
              <p className="text-danger">
                {errors.startDate && errors.startDate.message}
              </p>
            </Col>
            <Col xs={6}>
              <Controller
                control={control}
                name="endDate"
                rules={{
                  required: "Enter an end date",
                }}
                render={({ field }) => (
                  <DatePicker
                    placeholderText="End date"
                    onChange={(date) => field.onChange(date)}
                    selected={field.value}
                    calendarClassName="bootstrap-calendar"
                    className={`form-control mb-3
                      ${
                        getFieldState("endDate").isDirty
                          ? getFieldState("endDate").invalid
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    calendarStartDay={1}
                  />
                )}
              />
              <p className="text-danger">
                {errors.endDate && errors.endDate.message}
              </p>
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
              size="lg"
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
          <Col xs={6}>
            <Form.Label>Cube preferences required</Form.Label>
            <Form.Select {...register("preferencesRequired")} className="mb-3">
              {[0, 1, 2, 3, 4, 5].map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Row>
            <Form.Group className="mb-3" controlId="userEnrollmentEnabled">
              <Form.Check
                {...register("userEnrollmentEnabled")}
                defaultChecked={true}
                type="checkbox"
                label="Enable user enrollment"
                className="fs-5"
              />
              <p className="small">
                Choose whether you want to allow users to enroll to the
                tournament by themselves (box checked), or if enrollment by
                staff is the only option (box unchecked).
              </p>
            </Form.Group>
          </Row>
          <Col xs={12} className="d-grid">
            <Button variant="info" type="submit" className="btn-lg text-light">
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
