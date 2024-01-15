import { Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loading from "../../components/general/Loading";
import { useIsAdmin } from "../../utils/auth";

const AdminPage = () => {
  const user = useIsAdmin();

  return user ? (
    <Container>
      <Row>
        <div>
          <h1>Admin page</h1>
          <Link to="/admin/create-tournament">Create tournament</Link>
        </div>
      </Row>
    </Container>
  ) : (
    <Loading />
  );
};

export default AdminPage;
