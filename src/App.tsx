import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/navigation";
import ExchangePage from "./components/exchange-page";
import PerpTrades from "./components/perp-trades";
import "./App.css";

function App() {
  return (
    <Router>
      <Navigation />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<ExchangePage />} />
          <Route path="/perp-trades" element={<PerpTrades />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
