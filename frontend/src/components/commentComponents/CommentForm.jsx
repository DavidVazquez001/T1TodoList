// frontend/src/components/CommentForm.jsx
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
      // Asegúrate de incluir taskId en la URL
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
      onCommentAdded(data.comment); // Notificar al componente padre sobre el nuevo comentario

      setSuccess("Comentario agregado exitosamente");
      setText(""); // Limpiar el formulario

      // Limpiar mensaje de éxito después de un tiempo
      setTimeout(() => setSuccess(""), 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
        className="border p-2 w-full"
        placeholder="Escribe tu comentario aquí..."
      />
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <button type="submit" className="bg-blue-500 text-white p-2">
        Agregar Comentario
      </button>
    </form>
  );
};

export default CommentForm;
