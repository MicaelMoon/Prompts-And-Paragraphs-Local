import {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {Entity} from "../types/entity"
import { invoke } from "@tauri-apps/api/core";

enum States {
    Main = "Main",
    NewGame = "New Game"
}

type MenuProps = {
    setPlayer: React.Dispatch<React.SetStateAction<Entity>>
    player: Entity
}

const Menu:React.FC<MenuProps> = ({setPlayer, player}) => { /* Might not update properly yet when calling to setPlayer. Might neeed useEffect. */
    const [currentState, setCurrentState] = useState<string>(States.Main);
    const [errorText, setErrorText] = useState<string>("No error")

    return (
        <div>
            <h1>{errorText}</h1>
            <button onClick={() => debug()}>Debug</button>
            {currentState !== States.Main ? (
                <button onClick={() => setCurrentState(States.Main)}>Main menu</button>
            ) : (<></>)}
            {currentState === States.Main ? (
                <>
                    <Link to="/game">
                        <h3>Start game</h3>
                    </Link>
                    <h3 onClick={() => setCurrentState(States.NewGame)}>
                        New Game
                    </h3>
                </>
            ) : currentState === States.NewGame ? (
                <Link to="/game" onClick={() => setPlayer(player)}>
                </Link>
            ) : (
                <h1>Unknown</h1>
            )}
        </div>
    )

    async function debug () {
        setErrorText("in debug")
        let response = await invoke("debug");
        setErrorText("Exit debug")
    }
}

export default Menu;