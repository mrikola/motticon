import { Helmet, HelmetProvider } from "react-helmet-async";

type Props = {
  titleText: string;
};

function HelmetTitle({ titleText }: Props) {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{"MottiCon \u{25a0} " + titleText}</title>
      </Helmet>
    </HelmetProvider>
  );
}

export default HelmetTitle;
