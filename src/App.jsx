import { useAuth } from "./context/AuthContext";
import Entrance from "./components/Entrance";
import Tablet from "./components/Tablet";
import Tunnel from "./components/Tunnel";

export default function App() {
  const { location, errorMsg } = useAuth();

  return (
    <div className="app-container">
      <header>
        <h1>🏔️ The Secret Mountain Pass</h1>
      </header>

      {errorMsg && <div className="error-banner">{errorMsg}</div>}

      <main>
        {location === "ENTRANCE" && <Entrance />}
        {location === "TABLET" && <Tablet />}
        {location === "TUNNEL" && <Tunnel />}
      </main>
    </div>
  );
}
