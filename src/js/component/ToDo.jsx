import React, { useState, useEffect } from "react";

const ToDo = () => {
    const [inputText, setInputText] = useState("");
    const [task, setTask] = useState(["Sacar al perro.", "Limpiar la casa.", "Estudiar."]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputText !== "") {
            // Agregar nueva tarea
            const updatedTasks = [...task, inputText];
            setTask(updatedTasks);
            setInputText("");
            console.log("Lista de tareas actual:", updatedTasks);

            // Crear formato para enviar a la API
            const toDoList = updatedTasks.map((item) => ({
                label: item,
                done: false
            }));
            console.log("Lista de tareas formateada para la API:", toDoList);

            // Hacer petición PUT
            fetch('https://playground.4geeks.com/todo/users/', {
                method: "PUT",
                body: JSON.stringify(toDoList),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    console.log("Estado de la respuesta:", response.status);
                    return response.text();
                })
                .then((result) => console.log("Resultado de la API:", result))
                .catch((error) => console.error("Error al realizar la petición:", error));
        } else {
            console.log("El campo de texto está vacío, no se puede agregar tarea.");
        }
    };

    const handleDelete = (i) => {
        console.log("Índice a eliminar:", i);
        console.log("Tareas antes de eliminar:", task);
        const updatedTasks = task.filter((_, index) => index !== i);
        console.log("Tareas después de eliminar:", updatedTasks);
        setTask(updatedTasks);
    };

    useEffect(() => {
        console.log("Estado de tareas actualizado:", task);
    }, [task]);

    return (
        <div className="container d-flex flex-column">
            <div className="text-center">
                <h1>ToDo's List</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    onChange={(e) => {
                        console.log("Texto ingresado:", e.target.value);
                        setInputText(e.target.value);
                    }}
                    value={inputText}
                    type="text"
                    placeholder="No tasks, add a task"
                />
                <ul className="list-group">
                    {task.map((item, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between">
                            <span>{item}</span>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => handleDelete(index)}
                            >
                            </button>
                        </li>
                    ))}
                </ul>
            </form>
        </div>
    );
};

export default ToDo;
