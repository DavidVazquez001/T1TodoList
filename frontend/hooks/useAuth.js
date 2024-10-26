"use client"; // Añadir esta línea al principio para indicar que es un componente cliente

import { useRouter } from "next/navigation"; // Cambiar el import para usar el nuevo paquete de navegación
import { useEffect } from "react";

const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Verificar si el token existe
    if (!token) {
      router.push("/"); // Redirigir a la página de inicio si no hay token
      return;
    }

    // Validar si el token aún es válido llamando al backend
    fetch("http://localhost:5000/auth/verify-token", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          // Si el token es inválido o ha expirado, redirigir al inicio
          localStorage.removeItem("token");
          router.push("/"); // Redirigir al inicio
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/"); // Redirigir al inicio
      });
  }, [router]);
};

export default useAuth;
