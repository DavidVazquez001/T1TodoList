const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Task = require("../models/taskModel");
const Subtask = require("../models/subtaskModel");

// Ruta para crear nueva tarea
router.post("/", authMiddleware, async (req, res) => {
  //   console.log("User ID:", req.userId);
  const { title, description } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      user: req.userId, // Guardar el ID del usuario
    });

    // console.log("User ID:", req.userId);

    await newTask.save();
    res.status(201).json({ message: "Tarea creada", task: newTask });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear la tarea", error: error.message });
  }
});

// Ruta para listar todas las tareas
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId }); // Filtrar tareas por el ID del usuario
    res.status(200).json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las tareas", error: error.message });
  }
});

// Ruta para actualizar una tarea existente
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, description, status } = req.body;

    // Buscar tarea
    const task = await Task.findOne({ _id: taskId, user: req.userId });
    if (!task) {
      return res
        .status(404)
        .json({ message: "Tarea no encontrada o acceso no autorizado" });
    }

    if (status === "completada") {
      // Buscar subtarea
      const subtasks = await Subtask.find({ task: taskId });
      const pendingSubtasks = subtasks.some(
        (subtask) => subtask.status === "pendiente"
      );
      if (pendingSubtasks) {
        return res.status(400).json({
          message: "No se puede completar la tarea: hay subtareas pendientes",
        });
      }
    }

    // Actualizar campos
    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;

    // Guardar tarea
    await task.save();
    res.status(200).json({ message: "Tarea actualizada", task });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar la tarea", error: error.message });
  }
});

// Ruta para eliminar una tarea existente
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const taskId = req.params.id;

    // Buscar y borrar tarea
    const task = await Task.findOneAndDelete({ _id: taskId, user: req.userId });
    if (!task) {
      return res
        .status(404)
        .json({ message: "Tarea no encontrada o acceso no autorizado" });
    }

    res.status(200).json({ message: "Tarea eliminada correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar la tarea", error: error.message });
  }
});

// Obtener tareas por estado
router.get("/filter", authMiddleware, async (req, res) => {
  try {
    const { status } = req.query;

    if (!status || !["pendiente", "completada"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Estado inválido. Usa 'pendiente' o 'completada'." });
    }

    const tasks = await Task.find({ user: req.userId, status });

    res.status(200).json({ tasks });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las tareas", error: error.message });
  }
});

module.exports = router;
