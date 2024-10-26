import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token"); // Obtener el token de las cookies
  const { pathname } = req.nextUrl;

  // Si el usuario no tiene un token y está intentando acceder a páginas protegidas, redirigirlo
  if (!token && pathname !== "/login" && pathname !== "/register") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Continuar con la solicitud si hay un token o si está accediendo a páginas no protegidas
  return NextResponse.next();
}

// Especifica qué rutas quieres proteger
export const config = {
  matcher: ["/tasks/:path*", "/dashboard/:path*"], // Ajusta estas rutas según tu aplicación
};
