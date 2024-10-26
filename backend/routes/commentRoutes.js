const express = require("express");
const router = express.Router();
const Comment = require("../models/commentModel");
const authMiddleware = require("../middleware/authMiddleware");
const Subtask = require("../models/subtaskModel");

// Crear comentario
router.post("/:taskId", authMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { text } = req.body;

    const newComment = new Comment({
      task: taskId,
      user: req.userId,
      text: text,
    });

    const savedComment = await newComment.save();
    res
      .status(201)
      .json({ message: "Comentario creado", comment: savedComment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el comentario", error: error.message });
  }
});

router.get("/:taskId", authMiddleware, async (req, res) => {
  try {
    const comments = await Comment.find({
      task: req.params.taskId,
      user: req.userId,
    });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los comentarios",
      error: error.message,
    });
  }
});

// Actualizar comentario
router.put("/:commentId", authMiddleware, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    const comment = await Comment.findOne({ _id: commentId, user: req.userId });

    if (!comment) {
      return res
        .status(404)
        .json({ message: "Comentario no encontrado o no autorizado" });
    }

    if (text) comment.text = text;

    await comment.save();
    res.status(200).json({ message: "Comentario actualizado", comment });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el comentario",
      error: error.message,
    });
  }
});

router.delete("/:commentId", authMiddleware, async (req, res) => {
  try {
    const commentId = req.params.commentId;

    const commentDeleted = await Comment.findOneAndDelete({
      _id: commentId,
      user: req.userId,
    });

    if (!commentDeleted) {
      return res
        .status(404)
        .json({ message: "Comentario no encontrado o acceso no autorizado" });
    }

    res.status(200).json({ message: "Comentario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el comentario",
      error: error.message,
    });
  }
});

module.exports = router;
