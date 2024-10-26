"use client";

import { useEffect, useState } from "react";
import CreateTaskForm from "./taskComponents/CreateTaskForm";
import CommentForm from "./commentComponents/CommentForm";
import CommentItem from "./commentComponents/CommentItem";
import EditTaskForm from "./taskComponents/EditTaskForm";
import SubtaskForm from "./subtaskComponents/SubtaskForm";
import SubtaskItem from "./subtaskComponents/SubtaskItem";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [username, setUsername] = useState(""); // Para mostrar el nombre del usuario logueado

  useEffect(() => {
    fetchTasks();
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/tasks", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al obtener tareas");
      }

      const data = await response.json();
      setTasks(data);

      for (const task of data) {
        const commentsResponse = await fetch(
          `http://localhost:5000/comments/${task._id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json();
          task.comments = commentsData;
        }

        const subtasksResponse = await fetch(
          `http://localhost:5000/subtasks/${task._id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (subtasksResponse.ok) {
          const subtasksData = await subtasksResponse.json();
          task.subtasks = subtasksData;
        }
      }

      setTasks([...data]);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleTaskCreated = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleUpdateTask = async (taskId, updateData) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId
              ? {
                  ...updatedTask.task,
                  comments: task.comments,
                  subtasks: task.subtasks,
                }
              : task
          )
        );
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al eliminar la tarea");

      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      )
    );
    setEditingTask(null);
  };

  const handleDeleteComment = async (commentId, taskId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el comentario");
      }

      setTasks((prevTasks) => {
        return prevTasks.map((task) =>
          task._id === taskId
            ? {
                ...task,
                comments: task.comments.filter((c) => c._id !== commentId),
              }
            : task
        );
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCommentUpdated = (updatedComment) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => ({
        ...task,
        comments: task.comments.map((comment) =>
          comment._id === updatedComment._id ? updatedComment : comment
        ),
      }))
    );
  };

  const handleCommentAdded = (taskId, newComment) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId
          ? { ...task, comments: [...task.comments, newComment] }
          : task
      )
    );
  };

  const handleAddSubtask = (taskId, newSubtask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId
          ? { ...task, subtasks: [...(task.subtasks || []), newSubtask] }
          : task
      )
    );
  };

  const handleUpdateSubtask = async (updatedSubtask) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/subtasks/${updatedSubtask._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: updatedSubtask.title,
            description: updatedSubtask.description,
            status: updatedSubtask.status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar la subtarea");
      }

      const data = await response.json();

      setTasks((prevTasks) =>
        prevTasks.map((task) => ({
          ...task,
          subtasks: task.subtasks.map((subtask) =>
            subtask._id === data.subtask._id ? data.subtask : subtask
          ),
        }))
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const handleToggleSubtaskStatus = async (subtask) => {
    const token = localStorage.getItem("token");
    const newStatus =
      subtask.status === "pendiente" ? "completada" : "pendiente";

    try {
      const response = await fetch(
        `http://localhost:5000/subtasks/${subtask._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Error al cambiar el estado de la subtarea"
        );
      }

      const data = await response.json();

      setTasks((prevTasks) =>
        prevTasks.map((task) => ({
          ...task,
          subtasks: task.subtasks.map((subtaskItem) =>
            subtaskItem._id === data.subtask._id ? data.subtask : subtaskItem
          ),
        }))
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteSubtask = async (subtaskId, taskId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/subtasks/${subtaskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar la subtarea");
      }

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId
            ? {
                ...task,
                subtasks: task.subtasks.filter((s) => s._id !== subtaskId),
              }
            : task
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center">Mis Tareas</h1>

      <div className="flex justify-center items-center ">
        <CreateTaskForm onTaskCreated={handleTaskCreated} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {tasks.map((task) => (
          <div key={task._id} className="border p-4 rounded bg-white shadow-lg">
            {editingTask && editingTask._id === task._id ? (
              <EditTaskForm
                task={editingTask}
                onUpdate={handleTaskUpdated}
                onCancel={() => setEditingTask(null)}
              />
            ) : (
              <>
                <h2 className="font-bold text-lg">{task.title}</h2>
                <p className="text-gray-700 mb-2">{task.description}</p>
                <p className="text-sm text-gray-500">Estado: {task.status}</p>

                <div className="mt-4 flex flex-col space-y-2">
                  <button
                    onClick={() =>
                      handleUpdateTask(task._id, {
                        status:
                          task.status === "pendiente"
                            ? "completada"
                            : "pendiente",
                      })
                    }
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 rounded"
                  >
                    {task.status === "pendiente" ? "Completar" : "Revertir"}
                  </button>

                  <button
                    onClick={() => handleEditTask(task)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 rounded"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 rounded"
                  >
                    Eliminar
                  </button>
                </div>

                {/* Subtareas */}
                {task.subtasks && task.subtasks.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-800">Subtareas:</h3>
                    {task.subtasks.map((subtask) => (
                      <SubtaskItem
                        key={subtask._id}
                        subtask={subtask}
                        onUpdate={handleUpdateSubtask}
                        onStatusChange={handleToggleSubtaskStatus}
                        onDelete={(subtaskId) =>
                          handleDeleteSubtask(subtaskId, task._id)
                        }
                      />
                    ))}
                  </div>
                )}

                <SubtaskForm
                  taskId={task._id}
                  onSubtaskAdded={(subtask) =>
                    handleAddSubtask(task._id, subtask)
                  }
                />

                {/* Comentarios */}
                {task.comments && task.comments.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-800">
                      Comentarios:
                    </h3>
                    {task.comments.map((comment) => (
                      <CommentItem
                        key={comment._id}
                        comment={comment}
                        onDelete={(commentId) =>
                          handleDeleteComment(commentId, task._id)
                        }
                        onUpdate={(updatedComment) =>
                          handleCommentUpdated(updatedComment)
                        }
                      />
                    ))}
                  </div>
                )}

                <CommentForm
                  taskId={task._id}
                  onCommentAdded={(comment) =>
                    handleCommentAdded(task._id, comment)
                  }
                />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
