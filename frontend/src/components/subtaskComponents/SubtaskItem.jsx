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
    onStatusChange(subtask);
  };

  return (
    <div className="p-3 bg-gray-300 rounded-md shadow-sm mb-4">
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
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white p-1 rounded"
            >
              Actualizar
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white p-1 rounded"
            >
              Cancelar
            </button>
          </div>
        </>
      ) : (
        <>
          <h3 className="font-semibold">{subtask.title}</h3>
          <p>{subtask.description}</p>
          <p className="text-gray-500">Estado: {subtask.status}</p>
          <div className="flex space-x-2 mt-2">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-white p-1 rounded"
            >
              Editar
            </button>
            <button
              onClick={handleStatusToggle}
              className={`${
                subtask.status === "pendiente"
                  ? "bg-green-500"
                  : "bg-yellow-600"
              } text-white p-1 rounded`}
            >
              {subtask.status === "pendiente" ? "Completar" : "Revertir"}
            </button>
            <button
              onClick={() => onDelete(subtask._id)}
              className="bg-red-500 text-white p-1 rounded"
            >
              Eliminar
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SubtaskItem;
