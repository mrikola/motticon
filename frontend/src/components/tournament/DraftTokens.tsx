import { Col, Row } from "react-bootstrap";
import { Token } from "../../types/Card";

type Props = {
  tokens: Token[];
};

const DraftTokens = ({ tokens }: Props) => {
  if (tokens) {
    return (
      <Col xs={12}>
        <p className="lead">Remember to pick up these tokens:</p>
        <Row className="cube-tokens">
          {tokens.map((token, index) => (
            <Col xs={4} className="mb-3" key={index}>
              <img
                key={index}
                className="cube-token-img"
                src={`https://cards.scryfall.io/normal/front/${token.scryfallId.charAt(
                  0
                )}/${token.scryfallId.charAt(1)}/${token.scryfallId}.jpg`}
              />
              <p className="mb-0">
                {token.power !== null && token.toughness !== null && (
                  <>
                    {token.power}/{token.toughness}{" "}
                  </>
                )}
                {token.name}
              </p>
              <ul>
                {token.tokenFor.map((tokenGenerator) => (
                  <li key={tokenGenerator.id} className="small">
                    {tokenGenerator.name}
                  </li>
                ))}
              </ul>
            </Col>
          ))}
        </Row>
      </Col>
    );
  }
};

export default DraftTokens;
