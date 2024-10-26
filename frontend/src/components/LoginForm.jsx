"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al iniciar sesión");
      }

      const data = await response.json();
      setSuccess("Inicio de sesión exitoso");

      // Almacenar el token en localStorage
      localStorage.setItem("token", data.token);

      // Redirigir a la página de tareas
      router.push("/task");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 ">
      <div>
        <label htmlFor="username" className="block font-semibold">
          Nombre de Usuario
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="border p-2 w-full rounded border-neutral-500"
        />
      </div>
      <div>
        <label htmlFor="password" className="block font-semibold">
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2 w-full rounded border-neutral-500"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition"
      >
        Iniciar Sesión
      </button>
      {/* Botón para regresar al home */}
      <button
        type="button"
        onClick={() => router.push("/")}
        className="bg-gray-500 text-white p-2 rounded w-full mt-2 hover:bg-gray-600 transition"
      >
        Volver al Home
      </button>
    </form>
  );
};

export default LoginForm;
