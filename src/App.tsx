import { invoke } from "@tauri-apps/api/core";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import GameUI from "./components/game-ui";
import {Entity} from "./types/entity"

const player:Entity = new Entity('Hero', 20, 6, 3);

const App:React.FC = () => {
  return (
    <>
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<GameUI player={player}/>}/>
        </Routes>
      </div>
    </Router>
    </>
  )
}

export default App;
