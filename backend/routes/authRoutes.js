const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("../models/userModel");
const JWT_SECRET = process.env.JWT_SECRET;

// Ruta de registro
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: "Usuario registrado" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error en el registro", error: err.message });
  }
});

// Ruta de inicio de sesión
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userFound = await User.findOne({ username });
    if (!userFound) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ userId: userFound._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Inicio de sesión exitoso", token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el inicio de sesión", error: error.message });
  }
});

// Nueva ruta para verificar el token
router.get("/verify-token", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Token no proporcionado o inválido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verificar si el token es válido
    jwt.verify(token, JWT_SECRET);
    res.status(200).json({ message: "Token válido" });
  } catch (error) {
    res.status(403).json({ message: "Token no válido o expirado" });
  }
});

module.exports = router;
