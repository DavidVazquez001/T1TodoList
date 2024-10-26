"use client";

import TaskList from "../../components/TaskList";
import useAuth from "../../../hooks/useAuth";

const TasksPage = () => {
  useAuth();

  return (
    <div className="flex justify-center items-start min-h-screen p-4">
      {" "}
      {/* Cambiar h-screen a min-h-screen */}
      <div className="w-full p-4 border rounded-lg shadow-lg bg-slate-400">
        {" "}
        {/* Mantener la tarjeta sin scroll */}
        <TaskList />
      </div>
    </div>
  );
};

export default TasksPage;
