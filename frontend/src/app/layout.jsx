import "./globals.css";

export const metadata = {
  title: "T1 Todo List",
  description: "Prueba técnica para T1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
