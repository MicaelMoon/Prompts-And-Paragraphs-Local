type chatProps = {
    playerPrompts: string[];
    aiResponses: string[];
}

const Chat:React.FC<chatProps> = ({playerPrompts, aiResponses}) => {
    return(
        <>
            {playerPrompts.map((prompt, index) => (
                <div key={index} className='chat-container text'>
                    <p className='player-prompt'>{prompt}</p>
                    {aiResponses[index] &&(
                        <div className='message-container'>
                            {aiResponses[index]
                                .split(/(".*?")/g)
                                .filter(Boolean)
                                .map((part, i) => {
                                    const isDialogue = /^".*"$/.test(part); // Fetches what is in between the double quotes
                                    const final = isDialogue ? part.slice(1, -1,) : part;
                                    return (
                                    <p key={i} className={isDialogue ? 'npc-text text' : 'ai-response text'}>
                                        {final}
                                    </p>
                                );
                            })}
                        </div>
                    )}
                </div>
            ))}
        </>
    )
}

export default Chat;