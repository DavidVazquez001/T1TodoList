"use client";

import { useRouter } from "next/navigation"; // Para redirigir
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  const navigateToLogin = () => {
    router.push("/login"); // Nueva ruta para Login
  };

  const navigateToRegister = () => {
    router.push("/register"); // Nueva ruta para Register
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-300 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">
          ¡Bienvenido a mi aplicación!
        </h1>
        <p className="text-center mb-6">
          Por favor, elige una opción para comenzar:
        </p>

        <div className="flex flex-col md:flex-row justify-around items-center">
          <button
            onClick={navigateToLogin}
            className="w-full md:w-auto bg-blue-500 text-white p-3 rounded-lg mb-4 md:mb-0 md:mr-2 transition duration-300 hover:bg-blue-600 focus:outline-none"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={navigateToRegister}
            className="w-full md:w-auto bg-green-500 text-white p-3 rounded-lg transition duration-300 hover:bg-green-600 focus:outline-none"
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
}
