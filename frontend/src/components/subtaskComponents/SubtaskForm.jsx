"use client";

import { useState } from "react";

const SubtaskForm = ({ taskId, onSubtaskAdded }) => {
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
      const response = await fetch("http://localhost:5000/subtasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, taskId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear la subtarea");
      }

      const data = await response.json();
      onSubtaskAdded(data.subtask);

      setSuccess("Subtarea creada exitosamente");
      setTitle("");
      setDescription("");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-slate-100 rounded shadow my-2"
    >
      <h4 className="font-semibold mb-2 text-gray-800">Agregar Subtarea</h4>
      <div>
        <label htmlFor="title" className="block text-gray-700">
          Título
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border p-2 w-full rounded"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-gray-700">
          Descripción
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="border p-2 w-full rounded"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
      >
        Agregar Subtarea
      </button>
    </form>
  );
};

export default SubtaskForm;
