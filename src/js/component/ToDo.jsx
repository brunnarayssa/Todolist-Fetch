import React, { useState, useEffect } from "react";

const ToDo = () => {
    const [inputText, setInputText] = useState("");
    const [tasks, setTasks] = useState([]);
    const user = "BrunnaCarvalho"; 

    const fetchTasks = () => {
        fetch(`https://playground.4geeks.com/todo/users/${user}`)
            .then(response => {
                if (response.status === 404) {
                    return createUser();
                }
                return response.json();
            })
            .then(data => {
                if (data.todos) {
                    setTasks(data.todos.map(todo => todo.label));
                }
            })
            .catch(error => console.log("Error al cargar tareas:", error));
    };

    const createUser = () => {
        return fetch(`https://playground.4geeks.com/todo/users/${user}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify([]),
        })
            .then(response => response.json())
            .then(() => fetchTasks())
            .catch(error => console.log("Error al crear usuario:", error));
    };

    const addTaskToAPI = (newTask) => {
        fetch(`https://playground.4geeks.com/todo/todos/${user}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ label: newTask, done: false }),
        })
            .then(response => response.json())
            .then(() => fetchTasks())
            .catch(error => console.log("Error al agregar tarea:", error));
    };

    const deleteAllTasks = () => {
        fetch(`https://playground.4geeks.com/todo/users/${user}`, {
            method: "DELETE" 
        })
            .then(() => setTasks([]))
            .catch(error => console.log("Error al eliminar todas las tareas:", error));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputText.trim() === "") return;
        addTaskToAPI(inputText);
        setInputText("");
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="container d-flex flex-column">
            <div className="text-center">
                <h1>ToDo's List</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    onChange={(e) => setInputText(e.target.value)}
                    value={inputText}
                    type="text"
                    placeholder="No tasks, add a task"
                />
                <button type="submit">Add Task</button>
                <button type="button" onClick={deleteAllTasks}>Delete All Tasks</button>
                <ul className="list-group">
                    {tasks.map((item, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between">
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </form>
        </div>
    );
};

export default ToDo;

