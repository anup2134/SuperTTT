import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./views/HomePage";
import SuperTTT from "./views/SuperTTT";
import Multiplayer from "./views/Multiplayer";
import Test from "./views/Test";
import { AppProvider } from "./Context";
import Rules from "./components/Rules";

const App = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/play" element={<SuperTTT />} />
          <Route path="/multiplayer" element={<Multiplayer />} />
          <Route path="/test" element={<Test />} />
          <Route path="/rules" element={<Rules />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;
