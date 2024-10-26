"use client";

import { useState } from "react";

const CreateTaskForm = ({ onTaskCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear tarea");
      }

      const data = await response.json();
      setSuccess("Tarea creada exitosamente");
      onTaskCreated(data.task);

      setTitle("");
      setDescription("");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 bg-white rounded-lg shadow-md border border-gray-200 w-full md:w-1/2 lg:w-1/3 justify-center items-center"
    >
      <div>
        <label
          htmlFor="title"
          className="block text-neutral-800 font-semibold mb-1"
        >
          Título
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Ingresa el título de la tarea"
          className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:border-blue-500"
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-neutral-800 font-semibold mb-1"
        >
          Descripción
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Ingresa la descripción de la tarea"
          className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:border-blue-500"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mt-4 transition duration-200"
      >
        Crear Tarea
      </button>
    </form>
  );
};

export default CreateTaskForm;
