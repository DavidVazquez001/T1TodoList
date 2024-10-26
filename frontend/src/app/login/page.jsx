import LoginForm from "../../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-4 border rounded-lg shadow-lg">
        <h1 className="text-xl font-bold mb-4">Iniciar Sesión</h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;