import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./views/HomePage";
import SuperTTT from "./views/SuperTTT";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/play" element={<SuperTTT />} />
      </Routes>
    </Router>
  );
};

export default App;
