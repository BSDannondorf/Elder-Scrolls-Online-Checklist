import React, { useEffect, useState } from 'react';

const Table = () => {
    const [goals, setGoals] = useState([])
    const [characterList, setCharacterList] = useState([])
    const [characterInput, setCharacterInput] = useState('')
    const [selectedChar, setSelectedChar] = useState('any character')
    const [dailyInput, setDailyInput] = useState('')
    const [selectedCharTwo, setSelectedCharTwo] = useState('any character')
    const [oneOffInput, setOneOffInput] = useState('')
    const [characterEditing, setCharacterEditing] = useState(null)
    const [characterEditInput, setCharacterEditInput] = useState('')
    const [dailyEditing, setDailyEditing] = useState(null)
    const [dailyEditInput, setDailyEditInput] = useState('')
    const [oneOffEditing, setOneOffEditing] = useState(null)
    const [oneOffEditInput, setOneOffEditInput] = useState('')

    useEffect(() => {
        const storedGoals = localStorage.getItem("storedGoals")
            ? JSON.parse(localStorage.getItem("storedGoals"))
            : { users: [{ name: 'any character', dailies: [], oneOffs: [] }] };
        setGoals(storedGoals);
        const now = new Date()
        const nextReset = new Date(now)
        nextReset.setUTCHours(10,0,0,0)
        if(now >= nextReset){
            nextReset.setUTCDate(nextReset.getUTCDate() + 1)
        }
        const timeUntilNextReset = nextReset - now
        let storedResetTime = localStorage.getItem("storedResetTime")
            ? new Date(localStorage.getItem("storedResetTime"))
            : null
        if(storedResetTime && (now >= storedResetTime)){
            resetDailies(storedGoals)
        }
        localStorage.setItem("storedResetTime", nextReset.toISOString())
        setTimeout(resetAndSetupResets, timeUntilNextReset)
    }, []);

    useEffect(() => {
        if (goals.users) {
            const charArr = goals.users.map(each => each.name);
            setCharacterList(charArr);
        }
    }, [goals]);
    
    const resetDailies = (obj) => {
        let newGoals = { users: [...obj.users] };
        for (let each of newGoals.users) {
            for (let every of each.dailies) {
                every.done = false;
            }
        }
        setGoals(newGoals);
        localStorage.setItem("storedGoals", JSON.stringify(newGoals));
    };

    const resetDailiesAndStoreNextReset = () => {
        resetDailies(goals)
        const twentyFourLater = new Date()
        twentyFourLater.setUTCDate(twentyFourLater.getUTCDate() + 1)
        localStorage.setItem("storedResetTime", twentyFourLater.toISOString())
    }

    const resetAndSetupResets = () => {
        resetDailiesAndStoreNextReset()
        setInterval(resetDailiesAndStoreNextReset, 24 * 60 * 60 * 1000)
    }

    const addCharacter = () => {
        const updatedGoals = {
            users: [...goals.users, { name: characterInput, dailies: [], oneOffs: [] }]
        }
        setGoals(updatedGoals)
        localStorage.setItem("storedGoals", JSON.stringify(updatedGoals))
        setCharacterInput('')
    }
    
    const handleCharSelection = (e) =>{
        setSelectedChar(e.target.value)
    }
    
    const addDaily = () => {
        let foundOne = goals.users.find(user => user.name === selectedChar)
        let place = goals.users.indexOf(foundOne)
        goals.users[place].dailies.push({task: dailyInput, done: false})
        localStorage.setItem("storedGoals", JSON.stringify(goals))
        setDailyInput('')
    }
    
    const handleCharSelectionTwo = (e) =>{
        setSelectedCharTwo(e.target.value)
    }
    
    const addOneOff = () => {
        let foundOne = goals.users.find(user => user.name === selectedCharTwo)
        let place = goals.users.indexOf(foundOne)
        goals.users[place].oneOffs.push(oneOffInput)
        localStorage.setItem("storedGoals", JSON.stringify(goals))
        setOneOffInput('')
    }

    const characterEditClick = (userIndex, str) => {
        event.preventDefault()
        setCharacterEditing({userIndex})
        setCharacterEditInput(str)
    };
    
    const characterEditSave = (userIndex) => {
        const updatedGoals = {users: [...goals.users]};
        updatedGoals.users[userIndex].name = characterEditInput;
        setGoals(updatedGoals);
        localStorage.setItem("storedGoals", JSON.stringify(updatedGoals))
        setCharacterEditing(null)
    };
    
    const deleteCharacter = (userIndex) => {
        event.preventDefault()
        let newGoals = {users: [...goals.users]}
        newGoals.users.splice(userIndex, 1)
        setGoals(newGoals)
        localStorage.setItem("storedGoals", JSON.stringify(newGoals))
        setCharacterEditing(null)
    };
    
    const moveCharacterUp = (userIndex, str) => {
        setCharacterEditing(null)
        event.preventDefault()
        let newGoals = {users: [...goals.users]}
        let userObj = {name: str, dailies: [...newGoals.users[userIndex].dailies], oneOffs: [...newGoals.users[userIndex].oneOffs]}
        let n = newGoals.users.length
        newGoals.users.splice(userIndex, 1)
        newGoals.users.splice((userIndex - 1 + n) % n, 0, userObj)
        setGoals(newGoals)
        localStorage.setItem("storedGoals", JSON.stringify(newGoals))
    };
    
    const moveCharacterDown = (userIndex, str) => {
        setCharacterEditing(null)
        event.preventDefault()
        let newGoals = {users: [...goals.users]}
        let userObj = {name: str, dailies: [...newGoals.users[userIndex].dailies], oneOffs: [...newGoals.users[userIndex].oneOffs]}
        let n = newGoals.users.length
        newGoals.users.splice(userIndex, 1)
        newGoals.users.splice((userIndex + 1) % n, 0, userObj)
        setGoals(newGoals)
        localStorage.setItem("storedGoals", JSON.stringify(newGoals))
    };
    
    const handleDailyClick = (e) => {
        let newGoals = {users: [...goals.users]}
        let foundName = e.target.className
        let foundUser = newGoals.users.find(user => user.name === foundName)
        let foundTask = e.target.getAttribute('value')
        let foundDaily = foundUser.dailies.find(daily => daily.task === foundTask)
        if(foundDaily){
            foundDaily.done = true
            setGoals(newGoals)
            localStorage.setItem("storedGoals", JSON.stringify(newGoals))
        }
    }
    
    const dailyEditClick = (userIndex, taskIndex, task) => {
        event.preventDefault()
        setDailyEditing({ userIndex, taskIndex })
        setDailyEditInput(task)
    };
    
    const dailyEditSave = () => {
        const updatedGoals = { ...goals };
        updatedGoals.users[dailyEditing.userIndex].dailies[dailyEditing.taskIndex].task = dailyEditInput;
        setGoals(updatedGoals);
        localStorage.setItem("storedGoals", JSON.stringify(updatedGoals))
        setDailyEditing(null)
    };
    
    const deleteDaily = (userIndex, taskIndex) => {
        event.preventDefault()
        let newGoals = {users: [...goals.users]}
        newGoals.users[userIndex].dailies.splice(taskIndex, 1)
        setGoals(newGoals)
        localStorage.setItem("storedGoals", JSON.stringify(newGoals))
        setDailyEditing(null)
    };
    
    const moveDailyUp = (userIndex, taskIndex, task) => {
        setDailyEditing(null)
        event.preventDefault()
        let newGoals = {users: [...goals.users]}
        let taskObj = {task: task, done: false}
        let n = newGoals.users[userIndex].dailies.length
        newGoals.users[userIndex].dailies.splice(taskIndex, 1)
        newGoals.users[userIndex].dailies.splice((taskIndex - 1 + n) % n, 0, taskObj)
        setGoals(newGoals)
        localStorage.setItem("storedGoals", JSON.stringify(newGoals))
    };
    
    const moveDailyDown = (userIndex, taskIndex, task) => {
        setDailyEditing(null)
        event.preventDefault()
        let newGoals = {users: [...goals.users]}
        let taskObj = {task: task, done: false}
        let n = newGoals.users[userIndex].dailies.length
        newGoals.users[userIndex].dailies.splice(taskIndex, 1)
        newGoals.users[userIndex].dailies.splice((taskIndex + 1) % n, 0, taskObj)
        setGoals(newGoals)
        localStorage.setItem("storedGoals", JSON.stringify(newGoals))
    };
    
    const handleResetButton = (e) => {
        let newGoals = {users: [...goals.users]}
        let foundName = e.target.getAttribute('value')
        let foundUser = newGoals.users.find(user => user.name === foundName)
        if(foundUser){
            for(let each of foundUser.dailies){
                each.done = false
            }
            setGoals(newGoals)
            localStorage.setItem("storedGoals", JSON.stringify(newGoals))
        }
    }
    
    const oneOffEditClick = (userIndex, oneOffIndex, oneOff) => {
        event.preventDefault()
        setOneOffEditing({ userIndex, oneOffIndex })
        setOneOffEditInput(oneOff)
    };
    
    const oneOffEditSave = () => {
        const updatedGoals = { ...goals };
        updatedGoals.users[oneOffEditing.userIndex].oneOffs[oneOffEditing.oneOffIndex] = oneOffEditInput;
        setGoals(updatedGoals);
        localStorage.setItem("storedGoals", JSON.stringify(updatedGoals))
        setOneOffEditing(null)
    };
    
    const deleteOneOff = (userIndex, oneOffIndex) => {
        event.preventDefault()
        let newGoals = {users: [...goals.users]}
        newGoals.users[userIndex].oneOffs.splice(oneOffIndex, 1)
        setGoals(newGoals)
        localStorage.setItem("storedGoals", JSON.stringify(newGoals))
        setOneOffEditing(null)
    };
    
    const moveOneOffUp = (userIndex, oneOffIndex, oneOff) => {
        setOneOffEditing(null)
        event.preventDefault()
        let newGoals = {users: [...goals.users]}
        let n = newGoals.users[userIndex].oneOffs.length
        newGoals.users[userIndex].oneOffs.splice(oneOffIndex, 1)
        newGoals.users[userIndex].oneOffs.splice((oneOffIndex - 1 + n) % n, 0, oneOff)
        setGoals(newGoals)
        localStorage.setItem("storedGoals", JSON.stringify(newGoals))
    };
    
    const moveOneOffDown = (userIndex, oneOffIndex, oneOff) => {
        setOneOffEditing(null)
        event.preventDefault()
        let newGoals = {users: [...goals.users]}
        let n = newGoals.users[userIndex].oneOffs.length
        newGoals.users[userIndex].oneOffs.splice(oneOffIndex, 1)
        newGoals.users[userIndex].oneOffs.splice((oneOffIndex + 1) % n, 0, oneOff)
        setGoals(newGoals)
        localStorage.setItem("storedGoals", JSON.stringify(newGoals))
    };
    
    return (
        <>
            <table border="1">
                <thead>
                    <tr>
                        <th colSpan={3}>To-Do's</th>
                    </tr>
                    <tr>
                        <th colSpan={3}>
                            <div>
                                Add Character: <input
                                    type="text"
                                    name="characterInput"
                                    onChange={e => setCharacterInput(e.target.value)}
                                    value = {characterInput}
                                />
                                <button type="button" onClick={addCharacter}>Add</button>
                            </div>
                            <div>
                                Add Daily Task: <select value={selectedChar} onChange={handleCharSelection}>
                                    {
                                        characterList.map(char =>{
                                            return(
                                                <option key={char} value={char}>{char}</option>
                                            )
                                        })
                                    }
                                </select>
                                <input
                                        type="text"
                                        name="dailyInput"
                                        onChange={e => setDailyInput(e.target.value)}
                                        value = {dailyInput}
                                />
                                <button type="button" onClick={addDaily}>Add</button>
                            </div>
                            <div>
                                Add One-Time Task:<select value={selectedCharTwo} onChange={handleCharSelectionTwo}>
                                    {
                                        characterList.map(char =>{
                                            return(
                                                <option key={char} value={char}>{char}</option>
                                            )
                                        })
                                    }
                                </select>
                                <input
                                        type="text"
                                        name="oneOffInput"
                                        onChange={e => setOneOffInput(e.target.value)}
                                        value = {oneOffInput}
                                />
                                <button type="button" onClick={addOneOff}>Add</button>
                            </div>
                        </th>
                    </tr>
                    <tr>
                        <th>Character</th>
                        <th>Daily Tasks</th>
                        <th>One-Time Tasks</th>
                    </tr>
                </thead>
                <tbody>
                    
                    {goals.users && goals.users.map((user, userIndex) => (
                        <tr key={user.name}>
                            <td>
                                {characterEditing && characterEditing.userIndex === userIndex ? (
                                    <>
                                        <input
                                            type="text"
                                            value={characterEditInput}
                                            onChange={e => setCharacterEditInput(e.target.value)}
                                        />
                                        <button onClick={() => characterEditSave(userIndex)}>Save</button>
                                        <button onClick={() => setCharacterEditing(null)}>Cancel</button>
                                        <button onClick={() => deleteCharacter(userIndex)}>Delete</button>
                                    </>
                                ) : (
                                    <>
                                        {user.name} <a href="#" onClick={() => characterEditClick(userIndex, user.name)}>edit</a> <a onClick={() => moveCharacterUp(userIndex, user.name)}>↑</a> <a onClick={() => moveCharacterDown(userIndex, user.name)}>↓</a>
                                    </>
                                )}
                                
                            </td>
                            <td>
                                <ul>
                                    {user.dailies.map((daily, taskIndex) => (
                                        !daily.done && (
                                            <li key={taskIndex}>
                                                {dailyEditing && dailyEditing.userIndex === userIndex && dailyEditing.taskIndex === taskIndex ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            value={dailyEditInput}
                                                            onChange={e => setDailyEditInput(e.target.value)}
                                                        />
                                                        <button onClick={dailyEditSave}>Save</button>
                                                        <button onClick={() => setDailyEditing(null)}>Cancel</button>
                                                        <button onClick={() => deleteDaily(userIndex, taskIndex)}>Delete</button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className={user.name} value={daily.task} onClick={handleDailyClick}>{daily.task}</span> <a href="#" onClick={() => dailyEditClick(userIndex, taskIndex, daily.task)}>edit</a> <a onClick={() => moveDailyUp(userIndex, taskIndex, daily.task)}>↑</a> <a onClick={() => moveDailyDown(userIndex, taskIndex, daily.task)}>↓</a>
                                                    </>
                                                )}
                                            </li>
                                        )
                                    ))}
                                </ul>
                                <button type="button" value={user.name} onClick={handleResetButton}>Reset</button>
                            </td>
                            <td>
                                <ul>
                                    {user.oneOffs.map((oneOff, oneOffIndex) => (
                                        <li key={oneOffIndex}>
                                            {oneOffEditing && oneOffEditing.userIndex === userIndex && oneOffEditing.oneOffIndex === oneOffIndex ? (
                                                <>
                                                    <input
                                                        type="text"
                                                        value={oneOffEditInput}
                                                        onChange={e => setOneOffEditInput(e.target.value)}
                                                    />
                                                    <button onClick={oneOffEditSave}>Save</button>
                                                    <button onClick={() => setOneOffEditing(null)}>Cancel</button>
                                                    <button onClick={() => deleteOneOff(userIndex, oneOffIndex)}>Delete</button>
                                                </>
                                            ) : (
                                                <>
                                                    {oneOff} <a href="#" onClick={() => oneOffEditClick(userIndex, oneOffIndex, oneOff)}>edit</a> <a onClick={() => moveOneOffUp(userIndex, oneOffIndex, oneOff)}>↑</a> <a onClick={() => moveOneOffDown(userIndex, oneOffIndex, oneOff)}>↓</a>
                                                </>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default Table;