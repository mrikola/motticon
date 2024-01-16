import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loading from "../../components/general/Loading";
import { useIsAdmin } from "../../utils/auth";
import { TrophyFill } from "react-bootstrap-icons";
import { Helmet, HelmetProvider } from "react-helmet-async";

const AdminPage = () => {
  const user = useIsAdmin();

  return user ? (
    <Container className="mt-3 my-md-4">
      <HelmetProvider>
        <Helmet>
          <title>MottiCon &#9632; Admin</title>
        </Helmet>
      </HelmetProvider>
      <Row>
        <Col xs={12}>
          <h1 className="display-1">Admin page</h1>
        </Col>
        <Col xs={12}>
          <Link to="/admin/create-tournament">
            <Button variant="primary">
              <TrophyFill /> Create tournament
            </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  ) : (
    <Loading />
  );
};

export default AdminPage;
