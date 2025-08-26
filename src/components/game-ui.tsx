import {useState, useEffect} from 'react'
import "../styles/game-ui.css"
import {Entity} from "../../../../AI-Adventure/Frontend/client/src/types/entity"
import BattleMenu from './battle-menu'
import PlayerTable from './player-table'
import Chat from './chat'
import { invoke } from "@tauri-apps/api/core";

type GameUIProps = {
    player:Entity
}

const GameUI:React.FC<GameUIProps> = ({player}) =>{
    const [party, setParty] = useState<Entity[]>([]);
    const [enemyList, setEnemyList] = useState<Entity[]>([]);
    const [playerStats, setPlayerStats] = useState<Entity>(player);
    const [playerPrompts, setPlayerPrompts] = useState<string[]>([]);
    const [aiResponses, setAiResponses] = useState<string[]>([])
    const [playerMessage, setPlayerMessage] = useState<string>("")
    const [messageIsLoading, setMessageIsLoading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>("")

    useEffect(() => {
        setPlayerStats(player);
    },[player])

    useEffect(() => {
        setMessageIsLoading(messageIsLoading)
    }, [])

    useEffect(() => {
        setPlayerPrompts(["I want to look for traps"]);
    }, [])

    useEffect(() => {
        setAiResponses(['You almost stepped on a trap. "Be careful there!" -said John.']);
    }, [])

    useEffect(() => {
        setParty([
            playerStats,
            new Entity('Henry', 20, 5, 5),
            new Entity('Elara', 16, 4, 3)
        ])
    }, [])

    useEffect(() => {
        setEnemyList([
            new Entity('Troll', 25, 7, 5),
            new Entity('Goblin', 14, 4, 1),
            new Entity('Hound', 7, 3, 0),
        ])
    }, [])

    return (
        <>
            <div className="container">
                <div className="column game-column">
                    <PlayerTable player={playerStats} allies={party} enemies={enemyList} onAttack={attack}/>
                    <hr/>
                    <BattleMenu player={playerStats} allies={party} enemies={enemyList}/>
                </div>

                <div className="column chat-column">
                    <Chat playerPrompts={playerPrompts} aiResponses={aiResponses}/>
                    <form
                    className='row'
                    onSubmit={(e) => {
                        e.preventDefault();
                        sendMessage(playerMessage);
                    }}
                    >
                        <input onChange={(e) => setPlayerMessage(e.currentTarget.value)} placeholder='Enter message...'/>    
                        <button type='submit'>Send</button>
                    </form>
                    <button onClick={() => debug(playerStats)}>Debug</button>
                    {messageIsLoading && <h1>Loading...</h1>}
                    {messageIsLoading && <h1>{errorMessage}</h1>}
                </div>
            </div>
        </>
    )
    
    function debug(entity:Entity){
        const updatedEntity = Object.assign(
            Object.create(Object.getPrototypeOf(entity)),
            entity
        );
        updatedEntity.takeDamage(4);
        setPlayerStats(updatedEntity);
    }

    async function sendMessage(prompt: string){
        setMessageIsLoading(true)

        setPlayerPrompts((prev) => [...prev, prompt])

        let response = await invoke<string>("send_prompt", { prompt })

        setAiResponses((prev) => [...prev, response])

        setMessageIsLoading(false)
    }

    function attack(target:Entity, damage:number,flavorText:string){
        const updatedEnemyList = [...enemyList]
        updatedEnemyList.map((enemy:Entity) => {
            if(enemy.name === target.name){
                enemy.takeDamage(damage)
            }
        })

        setEnemyList(updatedEnemyList)
        console.log("Debugging")
        if(flavorText !== "" && flavorText !== null){
            setPlayerPrompts(prev => [...prev, flavorText])
        } else{
            setPlayerPrompts(prev => [...prev, `I attack ${target.name}.`])
        }
    }
}

export default GameUI;