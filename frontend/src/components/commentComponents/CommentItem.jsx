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

  //   const handleDelete = async () => {
  //     const token = localStorage.getItem("token");

  //     try {
  //       console.log("Attempting to delete comment with ID:", comment._id); // Depuración
  //       const response = await fetch(
  //         `http://localhost:5000/comments/${comment._id}`,
  //         {
  //           method: "DELETE",
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       if (!response.ok) {
  //         const errorData = await response.json();
  //         console.log("Failed to delete comment:", errorData); // Depuración
  //         throw new Error("Error al eliminar el comentario");
  //       }

  //       onDelete(comment._id); // Notificar al componente padre para eliminar el comentario
  //     } catch (err) {
  //       console.error("Error while deleting comment:", err); // Mostrar el error en la consola
  //       setError(err.message);
  //     }
  //   };

  const handleDelete = () => {
    onDelete(comment._id); // Notificar al componente padre para eliminar el comentario
  };

  return (
    <div className="border p-2 mt-1 rounded">
      {isEditing ? (
        <>
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="border p-2 w-full"
            id="comment-edit" // Añadir id para evitar advertencias
            name="comment-edit" // Añadir name para evitar advertencias
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white p-1 mr-2"
          >
            Actualizar
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-500 text-white p-1"
          >
            Cancelar
          </button>
        </>
      ) : (
        <>
          <p>{comment.text}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-yellow-500 text-white p-1 mr-2"
          >
            Editar
          </button>
          <button onClick={handleDelete} className="bg-red-500 text-white p-1">
            Eliminar
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </>
      )}
    </div>
  );
};

export default CommentItem;
