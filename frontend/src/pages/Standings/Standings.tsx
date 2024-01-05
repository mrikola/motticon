import { Table, Col, Container, Row } from "react-bootstrap";

function Standings() {
  const players = [];
  const max = 15;
  const min = 0;

  for (let n = 1; n <= 50; n++) {
    //generate random match points that are multiples of 3
    const points = Math.round((Math.floor(Math.random() * (max - min + 1)) + min) / 3) * 3;
    players.push({
          id: n,
          firstName: "Timo",
          lastName: "Tuuttari",
          matchPoints: points,
          draftWins: 0
        });

  }
  players.sort((a, b) => (a.matchPoints > b.matchPoints) ? -1 : 1)

  return (
    <Container className="mt-3 my-md-4">
     <Row>
     	<h1 className="display-1">Standings after round 5</h1>
     </Row>
    <Row>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Match Points</th>
          <th>Drafts Won</th>
        </tr>
      </thead>
      <tbody>
      {players.map((player, index) => (
        <tr 
        key={player.id}
        className={player.id === 5 ? 'table-info' : ''}
        >
          <td>{index+1}</td>
          <td>{player.firstName}</td>
          <td>{player.lastName}</td>
          <td>{player.matchPoints}</td>
          <td>{player.draftWins }</td>
        </tr>
        ))}
      </tbody>
    </Table>
    </Row>
    </Container>
  );
}

export default Standings;