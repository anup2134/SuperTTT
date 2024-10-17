import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./views/HomePage";
import SuperT from "./views/SuperT";
import Multiplayer from "./views/Multiplayer";
import Test from "./views/Test";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/play" element={<SuperT />} />
        <Route path="/multiplayer" element={<Multiplayer />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
  );
};

export default App;
