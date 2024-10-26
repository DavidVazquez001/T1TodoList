const mongoose = require("mongoose");

const subtaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    require: true,
  },

  status: {
    type: String,
    enum: ["pendiente", "completada"],
    default: "pendiente",
  },

  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Subtask = mongoose.model("Subtasks", subtaskSchema);

module.exports = Subtask;
