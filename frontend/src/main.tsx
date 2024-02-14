import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

// Import our custom CSS
import "./scss/style.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <Helmet>
      <meta charSet="utf-8" />
      <link rel="icon" type="image/svg+xml" href="/vite.svg" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Motticon</title>
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400&display=swap"
        rel="stylesheet"
      />
    </Helmet>
    <App />
    <ToastContainer newestOnTop />
  </HelmetProvider>
);
