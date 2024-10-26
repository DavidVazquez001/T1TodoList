// frontend/src/components/EditTaskForm.jsx
"use client";

import { useState, useEffect } from "react";

const EditTaskForm = ({ task, onUpdate, onCancel }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:5000/tasks/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar tarea");
      }

      const updatedTask = await response.json();
      setSuccess("Tarea actualizada exitosamente");

      // Notificar al componente padre con los datos actualizados
      onUpdate(updatedTask.task);

      // Limpiar mensajes de éxito después de un corto período de tiempo
      setTimeout(() => {
        setSuccess("");
        onCancel(); // Cerrar el formulario después de la actualización
      }, 1500);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block">
          Título
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label htmlFor="description" className="block">
          Descripción
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="border p-2 w-full"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <button type="submit" className="bg-blue-500 text-white p-2">
        Actualizar Tarea
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="bg-gray-500 text-white p-2 ml-2"
      >
        Cancelar
      </button>
    </form>
  );
};

export default EditTaskForm;
