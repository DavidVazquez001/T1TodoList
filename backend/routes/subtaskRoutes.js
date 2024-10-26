const express = require("express");
const router = express.Router();
const Subtask = require("../models/subtaskModel");
const authMiddleware = require("../middleware/authMiddleware");

// ruta para crear una subtarea
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, taskId } = req.body;

    const newSubtask = new Subtask({
      title,
      description,
      task: taskId, // referencia a la tarea principal
      user: req.userId,
    });

    await newSubtask.save();
    res.status(201).json({ message: "Subtarea creada", subtask: newSubtask });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear la subtarea", error: error.message });
  }
});

// Ruta para obtener subtareas
router.get("/:taskId", authMiddleware, async (req, res) => {
  try {
    const subtasks = await Subtask.find({
      task: req.params.taskId,
      user: req.userId,
    });

    res.status(200).json(subtasks);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las subtareas",
      error: error.message,
    });
  }
});

//Ruta para actualizar subtarea
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const subtaskId = req.params.id;
    const { title, description, status } = req.body;

    const subtask = await Subtask.findOne({ _id: subtaskId, user: req.userId });

    if (!subtask) {
      return res
        .status(404)
        .json({ message: "Subtarea no encontrada o acceso no autorizado" });
    }

    if (title) subtask.title = title;
    if (description) subtask.description = description;
    if (status) subtask.status = status;

    await subtask.save();
    res.status(200).json({ message: "Subtarea actualizada", subtask });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar la subtarea",
      error: error.message,
    });
  }
});

//Ruta para eliminar subtarea
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const subtaskId = req.params.id;

    const subtask = await Subtask.findOneAndDelete({
      _id: subtaskId,
      user: req.userId,
    });

    if (!subtask) {
      return res
        .status(404)
        .json({ message: "Subtarea no encontrada o acceso no autorizado" });
    }

    res.status(200).json({ message: "Subtarea eliminada" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar la subtarea", error: error.message });
  }
});

module.exports = router;
