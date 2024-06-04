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
        <Row>
          {tokens.map((token, index) => (
            <Col xs={4} className="mb-3" key={index}>
              <p>
                {token.power && (
                  <>
                    {token.power}/{token.toughness}{" "}
                  </>
                )}
                {token.name}
              </p>
              <img
                key={index}
                className="cube-token"
                src={`https://cards.scryfall.io/normal/front/${token.scryfallId.charAt(
                  0
                )}/${token.scryfallId.charAt(1)}/${token.scryfallId}.jpg`}
              />
              {token.tokenFor.map((tokenGenerator) => (
                <p key={tokenGenerator.id} className="small">
                  {tokenGenerator.name}
                </p>
              ))}
            </Col>
          ))}
        </Row>
      </Col>
    );
  }
};

export default DraftTokens;
