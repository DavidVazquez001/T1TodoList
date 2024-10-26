// frontend/pages/register.js
import RegisterForm from "../../components/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-4 border rounded-lg shadow-lg">
        <h1 className="text-xl font-bold mb-4">Registro de Usuario</h1>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
