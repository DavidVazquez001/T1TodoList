"use client";

import { useState } from "react";

const CommentForm = ({ taskId, onCommentAdded }) => {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:5000/comments/${taskId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al agregar comentario");
      }

      const data = await response.json();
      onCommentAdded(data.comment);
      setSuccess("Comentario agregado exitosamente");
      setText("");

      setTimeout(() => setSuccess(""), 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-slate-100 my-2 rounded shadow"
    >
      <h4 className="font-semibold mb-2 text-gray-800">Agregar Comentario</h4>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
        className="border p-2 w-full rounded"
        placeholder="Escribe tu comentario aquí..."
      />
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
      >
        Agregar Comentario
      </button>
    </form>
  );
};

export default CommentForm;
