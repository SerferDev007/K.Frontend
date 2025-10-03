import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./pro-theme.css";

import PageRoutes from "./routes/PageRoutes";

const App = () => {
  return (
    <div className="app-pro-theme">
      <PageRoutes />
    </div>
  );
};

export default App;
