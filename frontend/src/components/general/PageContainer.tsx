import { ReactNode } from "react";
import { Container } from "react-bootstrap";

type PageContainerProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Reusable page container component
 * Replaces the repeated pattern: <Container className="mt-3 my-md-4">
 */
function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <Container className={`mt-3 my-md-4 ${className}`.trim()}>
      {children}
    </Container>
  );
}

export default PageContainer;

