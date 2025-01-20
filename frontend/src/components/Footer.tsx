import { Container } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bd-footer py-4 py-md-5 mt-5 bg-body-tertiary small">
      <Container>
        <p className="text-center text-body-secondary">
          Magic: The Gathering is © Wizards of the Coast. MottiCon is not
          affiliated nor produced nor endorsed by Wizards of the Coast.
        </p>
        <p className="text-center text-body-secondary">
          All card images, mana symbols, expansions and art related to Magic the
          Gathering is a property of Wizards of the Coast/Hasbro.
        </p>
        <p className="text-center text-body-secondary">© 2024 MottiCon</p>
      </Container>
    </footer>
  );
};

export default Footer;
