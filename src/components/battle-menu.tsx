import {Entity} from '../../../../AI-Adventure/Frontend/client/src/types/entity'
import '../styles/battle-menu.css'
import { useEffect, useState } from 'react';

type BattleMenuProps = {
    player: Entity;
    allies: Entity[];
    enemies: Entity[];
}


const BattleMenu:React.FC<BattleMenuProps> = ({player, enemies, allies}) => {
    const [enemyList, setEnemyList] = useState<Entity[]>([]);
    
    useEffect(() => {
        setEnemyList(enemies)
    }, [enemyList])

    return (
        <div className='container battle-menu'>
            <div className='column ally-column'>
                {allies.map((ally, index) => (
                    <div key={index} className={`entity-card ${ally.name === player.name ? 'player-card' : 'ally-card'} `}>
                        <p>{ally.name}</p>
                        <p>Health: {ally.currentHealth}/{ally.maxHealth}</p>
                        <p>Attack: {ally.currentAttack}</p>
                        <p>Defense {ally.currentDefense}</p>
                    </div>
                ))}
            </div>
            <div className='column enemy-column'>
                {enemyList.map((enemy, index) => (
                    <div key={index} className='entity-card enemy-card'>   
                        <p>{enemy.name}</p>
                        <p>Health: {enemy.currentHealth}/{enemy.maxHealth}</p>
                        <p>Attack: {enemy.currentAttack}</p>
                        <p>Defense {enemy.currentDefense}</p>
                    </div>
                ))}
            </div>
        </div>

    )
}

export default BattleMenu;