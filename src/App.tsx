import { invoke } from "@tauri-apps/api/core";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import GameUI from "./components/game-ui";
import Menu from "./components/menu";
import {Entity} from "./types/entity"
import {useState} from 'react'

const defaultPlayer:Entity = new Entity('Hero', 20, 6, 3);

const App:React.FC = () => {
  const [player, setPlayer] = useState<Entity>(defaultPlayer)

  return (
    <>
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Menu setPlayer={setPlayer} player={player}/>}/>
          <Route path="/game" element={<GameUI player={player}/>}/>
        </Routes>
      </div>
    </Router>
    </>
  )
}

export default App;
