"use client";

import { useState } from "react";

const SubtaskItem = ({ subtask, onUpdate, onDelete, onStatusChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(subtask.title);
  const [editedDescription, setEditedDescription] = useState(
    subtask.description
  );

  const handleUpdate = () => {
    onUpdate({
      ...subtask,
      title: editedTitle,
      description: editedDescription,
    });
    setIsEditing(false);
  };

  const handleStatusToggle = () => {
    // Llamar a la función proporcionada para cambiar el estado
    onStatusChange(subtask); // Asegurarse de pasar la subtarea completa
  };

  return (
    <div className="border p-2 mt-1 rounded">
      {isEditing ? (
        <>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="border p-2 w-full"
          />
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
          <h3 className="font-semibold">{subtask.title}</h3>
          <p>{subtask.description}</p>
          <p className="text-gray-500">Estado: {subtask.status}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-yellow-500 text-white p-1 mr-2"
          >
            Editar
          </button>
          <button
            onClick={handleStatusToggle}
            className="bg-green-500 text-white p-1 mr-2"
          >
            {subtask.status === "pendiente" ? "Completar" : "Revertir"}
          </button>
          <button
            onClick={() => onDelete(subtask._id)}
            className="bg-red-500 text-white p-1"
          >
            Eliminar
          </button>
        </>
      )}
    </div>
  );
};

export default SubtaskItem;
