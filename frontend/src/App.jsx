import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import TaskList from "./components/TaskList/TaskList";
import TaskForm from "./components/TaskForm/TaskForm";
import { deleteTask, getTasks, updateTask } from "./api/taskApi.js";
import { useAuth } from "./context/useAuth.js";
import LoginPage from "./Pages/LoginPage.jsx";
import RegisterPage from "./Pages/RegisterPage.jsx";
import VerifyEmailPage from "./Pages/VerifyEmailPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [isTasksLoading, setIsTasksLoading] = useState(true);
  const [taskError, setTaskError] = useState("");
  const { accessToken, refreshAccessToken, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleAddTask(newTask) {
    setTasks((previousTasks) => [...previousTasks, newTask]);
  }

  async function handleUpdateTask(taskId, taskData) {
    try {
      const updatedTask = await updateTask(
        taskId,
        taskData,
        accessToken,
        refreshAccessToken,
      );
      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          (task._id || task.id) === taskId ? updatedTask : task,
        ),
      );
      setTaskError("");
    } catch (error) {
      setTaskError(error.message);
      throw error;
    }
  }

  async function handleDeleteTask(taskId) {
    try {
      await deleteTask(taskId, accessToken, refreshAccessToken);
      setTasks((previousTasks) =>
        previousTasks.filter((task) => (task._id || task.id) !== taskId),
      );
      setTaskError("");
    } catch (error) {
      setTaskError(error.message);
    }
  }

  async function handleLogout() {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      navigate("/login", {
        replace: true,
        state: {
          message: `Signed out locally, but server logout failed: ${error.message}`,
        },
      });
    }
  }

  useEffect(() => {
    let isCurrent = true;

    async function loadTasks() {
      setIsTasksLoading(true);
      try {
        const fetchedTasks = await getTasks(accessToken, refreshAccessToken);
        if (isCurrent) {
          setTasks(fetchedTasks);
          setTaskError("");
        }
      } catch (error) {
        if (isCurrent) setTaskError(error.message);
      } finally {
        if (isCurrent) setIsTasksLoading(false);
      }
    }

    loadTasks();
    return () => {
      isCurrent = false;
    };
  }, [accessToken, refreshAccessToken]);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 border-b border-slate-800 pb-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-teal-400">
                Workspace
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Task management
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                {user
                  ? `Welcome, ${user.name}.`
                  : "Keep your priorities visible and your next action clear."}
              </p>
            </div>
            <button
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-400"
              onClick={handleLogout}
              type="button"
            >
              Log out
            </button>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <div>
            {taskError && (
              <p
                className="mb-4 rounded-lg border border-rose-900 bg-rose-950/60 px-4 py-3 text-sm text-rose-200"
                role="alert"
              >
                {taskError}
              </p>
            )}
            {isTasksLoading ? (
              <p className="py-8 text-sm text-slate-400" role="status">
                Loading tasks...
              </p>
            ) : (
              <TaskList
                tasks={tasks}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
              />
            )}
          </div>
          <TaskForm
            accessToken={accessToken}
            refreshAccessToken={refreshAccessToken}
            onAddTask={handleAddTask}
          />
        </div>
      </div>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
