require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/tasksRoutes");
const subtaskRoutes = require("./routes/subtaskRoutes");
const commentRoutes = require("./routes/commentRoutes");
// Middleware para autenticar
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const port = 5000;

// Cors para conectar front con back
const cors = require("cors");
app.use(cors());

// Middleware para usar JSON
app.use(express.json());

/* RUTAS */
// Ruta raiz para validar express
app.get("/", (req, res) => {
  res.send("Express listo");
});

// Ruta para autenticar
app.use("/auth", authRoutes);

// Ruta de tareas
app.use("/tasks", taskRoutes);

// Ruta de subtareas
app.use("/subtasks", subtaskRoutes);

// Ruta de comentarios
app.use("/comments", commentRoutes);

/* VALIDAR CONEXIONES */
// Validar que express esta arriba
app.listen(port, () => {
  console.log("Servidor express arriba en puerto: ", port);
});

// Validar que se conecto a la base de datos

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((error) => console.log("Error conectando a MongoDB", error));
