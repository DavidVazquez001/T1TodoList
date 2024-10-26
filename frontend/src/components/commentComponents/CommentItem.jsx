"use client";

import { useState } from "react";

const CommentItem = ({ comment, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/comments/${comment._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: editedText }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar comentario");
      }

      const updatedComment = await response.json();
      onUpdate(updatedComment.comment);
      setIsEditing(false);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = () => {
    onDelete(comment._id);
  };

  return (
    <div className="border p-4 rounded-lg bg-gray-300 shadow-sm mb-4">
      {isEditing ? (
        <>
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="border p-2 w-full mb-2 rounded"
            placeholder="Edita tu comentario..."
          />
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleUpdate}
              className="bg-blue-500 hover:bg-blue-600 text-white p-1 px-3 rounded"
            >
              Actualizar
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white p-1 px-3 rounded"
            >
              Cancelar
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-gray-800">{comment.text}</p>
          <div className="flex items-center space-x-2 mt-3">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 px-3 rounded"
            >
              Editar
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white p-1 px-3 rounded"
            >
              Eliminar
            </button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </>
      )}
    </div>
  );
};

export default CommentItem;
