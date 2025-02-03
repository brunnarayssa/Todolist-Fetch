import React, { useState, useEffect } from "react";

const ToDo = () => {
    const [inputText, setInputText] = useState("");
    const [tasks, setTasks] = useState([]);
    const user = "BrunnaCarvalho"; // Nombre de usuario

    // Función para cargar las tareas desde la API al montar el componente
    useEffect(() => {
        fetch(`https://playground.4geeks.com/todo/users/${user}`)
            .then((response) => {
                if (!response.ok) {
                    // Si el usuario no existe, lo creamos
                    return fetch(`https://playground.4geeks.com/todo/users/${user}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify([]), // Crear usuario con una lista vacía de tareas
                    });
                }
                return response.json();
            })
            .then((data) => {
                if (data.todos) {
                    setTasks(data.todos.map((todo) => todo.label)); // Extraer las tareas
                }
            })
            .catch((error) => console.log("Error al cargar tareas:", error));
    }, []);

    // Función para enviar tareas a la API
    const updateTasksInAPI = (updatedTasks) => {
        const toDoList = updatedTasks.map((item) => ({
            label: item,
            done: false,
        }));

        fetch(`https://playground.4geeks.com/todo/users/${user}`, {
            method: "PUT",
            body: JSON.stringify(toDoList),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((result) => console.log("Tareas actualizadas:", result))
            .catch((error) => console.log("Error al actualizar tareas:", error));
    };

    // Función para manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputText.trim() === "") return;

        const updatedTasks = [...tasks, inputText];
        setTasks(updatedTasks);
        setInputText("");
        updateTasksInAPI(updatedTasks); // Actualizar la API
    };

    // Función para eliminar una tarea
    const handleDelete = (index) => {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
        updateTasksInAPI(updatedTasks); // Actualizar la API
    };

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
                <ul className="list-group">
                    {tasks.map((item, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between">
                            <span>{item}</span>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => handleDelete(index)}
                                aria-label="Eliminar tarea"
                            />
                        </li>
                    ))}
                </ul>
            </form>
        </div>
    );
};

export default ToDo;