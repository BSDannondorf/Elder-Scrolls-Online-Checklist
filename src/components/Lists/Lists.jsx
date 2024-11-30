import React, { useEffect, useState } from 'react';

const Lists = () => {
    const [lists, setLists] = useState([])
    const [listOfLists, setListOfLists] = useState([])
    const [listInput, setListInput] = useState('')
    const [selectedList, setSelectedList] = useState('pick list')
    const [liInput, setLiInput] = useState('')
    const [listEditing, setListEditing] = useState(null)
    const [listEditInput, setListEditInput] = useState('')
    const [liEditing, setLiEditing] = useState(null)
    const [liEditInput, setLiEditInput] = useState('')

    useEffect(() => {
        const storedLists = localStorage.getItem("storedLists")
            ? JSON.parse(localStorage.getItem("storedLists"))
            : { lists: [{ name: 'All Characters', listItems: [] }] };
        setLists(storedLists)
        setSelectedList(storedLists.lists[0].name)
    }, [])

    useEffect(() => {
        if(lists.lists){
            const listArr = lists.lists.map(each => each.name)
            setListOfLists(listArr)
        }
    }, [lists])

    const addList = () => {
        const updatedLists = {
            lists: [...lists.lists, { name: listInput, listItems: [] }]
        }
        setLists(updatedLists)
        localStorage.setItem("storedLists", JSON.stringify(updatedLists))
        setListInput('')
    }

    const handleListSelection = (e) =>{
        setSelectedList(e.target.value)
    }

    const addLi = () => {
        const updatedLists = {lists: [...lists.lists]}
        let foundList = updatedLists.lists.find(list => list.name === selectedList)
        let place = updatedLists.lists.indexOf(foundList)
        updatedLists.lists[place].listItems.push(liInput)
        setLists(updatedLists)
        localStorage.setItem("storedLists", JSON.stringify(lists))
        setLiInput('')
    }

    const listEditClick = (listIndex, str) => {
        event.preventDefault()
        setListEditing({listIndex})
        setListEditInput(str)
    };

    const listEditSave = (listIndex) => {
        const updatedLists = {lists: [...lists.lists]};
        updatedLists.lists[listIndex].name = listEditInput;
        setLists(updatedLists);
        localStorage.setItem("storedLists", JSON.stringify(updatedLists))
        setListEditing(null)
    };
    
    const deleteList = (listIndex) => {
        event.preventDefault()
        let newLists = {lists: [...lists.lists]}
        newLists.lists.splice(listIndex, 1)
        setLists(newLists)
        localStorage.setItem("storedLists", JSON.stringify(newLists))
        setListEditing(null)
    };
    
    const moveListUp = (listIndex, str) => {
        setListEditing(null)
        event.preventDefault()
        let newLists = {lists: [...lists.lists]}
        let listObj = {name: str, listItems: [...newLists.lists[listIndex].listItems]}
        let n = newLists.lists.length
        newLists.lists.splice(listIndex, 1)
        newLists.lists.splice((listIndex - 1 + n) % n, 0, listObj)
        setLists(newLists)
        localStorage.setItem("storedLists", JSON.stringify(newLists))
    };

    const moveListDown = (listIndex, str) => {
        setListEditing(null)
        event.preventDefault()
        let newLists = {lists: [...lists.lists]}
        let listObj = {name: str, listItems: [...newLists.lists[listIndex].listItems]}
        let n = newLists.lists.length
        newLists.lists.splice(listIndex, 1)
        newLists.lists.splice((listIndex + 1) % n, 0, listObj)
        setLists(newLists)
        localStorage.setItem("storedLists", JSON.stringify(newLists))
    };

    const liEditClick = (listIndex, liIndex, li) => {
        event.preventDefault()
        setLiEditing({ listIndex, liIndex })
        setLiEditInput(li)
    };
    
    const liEditSave = () => {
        const updatedLists = { lists: [...lists.lists] };
        updatedLists.lists[liEditing.listIndex].listItems[liEditing.liIndex] = liEditInput;
        setLists(updatedLists);
        localStorage.setItem("storedLists", JSON.stringify(updatedLists))
        setLiEditing(null)
    };
    
    const deleteLi = (listIndex, liIndex) => {
        event.preventDefault()
        let newLists = {lists: [...lists.lists]}
        newLists.lists[listIndex].listItems.splice(liIndex, 1)
        setLists(newLists)
        localStorage.setItem("storedLists", JSON.stringify(newLists))
        setLiEditing(null)
    };
    
    const moveLiUp = (listIndex, liIndex, li) => {
        setLiEditing(null)
        event.preventDefault()
        let newLists = {lists: [...lists.lists]}
        let n = newLists.lists[listIndex].listItems.length
        newLists.lists[listIndex].listItems.splice(liIndex, 1)
        newLists.lists[listIndex].listItems.splice((liIndex - 1 + n) % n, 0, li)
        setLists(newLists)
        localStorage.setItem("storedLists", JSON.stringify(newLists))
    };
    
    const moveLiDown = (listIndex, liIndex, li) => {
        setLiEditing(null)
        event.preventDefault()
        let newLists = {lists: [...lists.lists]}
        let n = newLists.lists[listIndex].listItems.length
        newLists.lists[listIndex].listItems.splice(liIndex, 1)
        newLists.lists[listIndex].listItems.splice((liIndex + 1) % n, 0, li)
        setLists(newLists)
        localStorage.setItem("storedLists", JSON.stringify(newLists))
    };
    
    return(
        <>
            <table border="1">
                <thead>
                    <tr>
                        <th colSpan={2}>Completed Tasks</th>
                    </tr>
                    <tr>
                        <th colSpan={2}>
                            <div>
                                Add List: <input
                                    type="text"
                                    name="listInput"
                                    onChange={e => setListInput(e.target.value)}
                                    value = {listInput}
                                />
                                <button type="button" onClick={addList}>Add</button>
                            </div>
                            <div>
                                Add List Item: <select value={selectedList} onChange={handleListSelection}>
                                    {
                                        listOfLists.map(listName =>{
                                            return(
                                                <option key={listName} value={listName}>{listName}</option>
                                            )
                                        })
                                    }
                                </select>
                                <input
                                        type="text"
                                        name="liInput"
                                        onChange={e => setLiInput(e.target.value)}
                                        value = {liInput}
                                />
                                <button type="button" onClick={addLi}>Add</button>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {lists.lists && lists.lists.map((list, listIndex) => (
                        <tr key={list.name}>
                            <td>
                                {listEditing && listEditing.listIndex === listIndex ? (
                                    <>
                                        <input
                                            type="text"
                                            value={listEditInput}
                                            onChange={e => setListEditInput(e.target.value)}
                                        />
                                        <button onClick={() => listEditSave(listIndex)}>Save</button>
                                        <button onClick={() => setListEditing(null)}>Cancel</button>
                                        <button onClick={() => deleteList(listIndex)}>Delete</button>
                                    </>
                                ) : (
                                    <>
                                        {list.name} <a href="#" onClick={() => listEditClick(listIndex, list.name)}>edit</a> <a onClick={() => moveListUp(listIndex, list.name)}>↑</a> <a onClick={() => moveListDown(listIndex, list.name)}>↓</a>
                                    </>
                                )}
                                
                            </td>
                            <td>
                                <ul>
                                    {list.listItems.map((li, liIndex) => (
                                        <li key={liIndex}>
                                            {liEditing && liEditing.listIndex === listIndex && liEditing.liIndex === liIndex ? (
                                                <>
                                                    <input
                                                        type="text"
                                                        value={liEditInput}
                                                        onChange={e => setLiEditInput(e.target.value)}
                                                    />
                                                    <button onClick={liEditSave}>Save</button>
                                                    <button onClick={() => setLiEditing(null)}>Cancel</button>
                                                    <button onClick={() => deleteLi(listIndex, liIndex)}>Delete</button>
                                                </>
                                            ) : (
                                                <>
                                                    {li} <a href="#" onClick={() => liEditClick(listIndex, liIndex, li)}>edit</a> <a onClick={() => moveLiUp(listIndex, liIndex, li)}>↑</a> <a onClick={() => moveLiDown(listIndex, liIndex, li)}>↓</a>
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
    )
}

export default Lists