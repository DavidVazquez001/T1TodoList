"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const response = await fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Error al registrar el usuario");
    } else {
      setSuccess("Usuario registrado con éxito");
      setUsername("");
      setPassword("");
      localStorage.setItem("token", data.token);

      // Redirigir a la página de tareas después de registrarse
      router.push("/task");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        className="bg-green-500 text-white p-2 rounded w-full hover:bg-green-600 transition"
      >
        Registrar
      </button>
      {/* Botón para ir al login */}
      <button
        type="button"
        onClick={() => router.push("/login")}
        className="bg-gray-500 text-white p-2 rounded w-full mt-2 hover:bg-gray-600 transition"
      >
        Ya tengo una cuenta, Iniciar Sesión
      </button>
    </form>
  );
};

export default RegisterForm;
