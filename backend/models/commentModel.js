const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  task: {
    type: Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },

  text: {
    type: String,
    required: true,
  },
});

const Comment = mongoose.model("Comments", commentSchema);

module.exports = Comment;
