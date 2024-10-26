import TaskList from "../components/TaskList";
import useAuth from "../hooks/useAuth";

const TasksPage = () => {
  useAuth(); // Verifica la autenticación antes de cargar

  return (
    <div>
      <TaskList />
    </div>
  );
};

export default TasksPage;
