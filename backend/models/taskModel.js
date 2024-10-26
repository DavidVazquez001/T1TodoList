const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["pendiente", "completada"],
    default: "pendiente",
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  subtasks: [
    {
      title: { type: String },
      status: {
        type: String,
        enum: ["pendiente", "completada"],
        default: "pendiente",
      },
    },
  ],
});

const Task = mongoose.model("Tasks", taskSchema);

module.exports = Task;
