import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "../App.css";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchString, setSearchString] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [summary, setSummary] = useState("");
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId || storedUserId !== userId) {
      navigate("/");
    }
  }, [userId, navigate]);

  useEffect(() => {
    const filteredTasks = tasks
      .filter(
        (task) =>
          task.title.toLowerCase().includes(searchString.toLowerCase()) ||
          (task.description &&
            task.description.toLowerCase().includes(searchString.toLowerCase()))
      )
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    setFilteredTasks(filteredTasks);
  }, [searchString, tasks]);

  useEffect(() => {
    if (userId) {
      getTasks();
    }
  }, [userId]);

  function getTasks() {
    setLoading(true);
    axios
      .get(`http://localhost:3000/${userId}/tasks`)
      .then((response) => {
        console.log("Tasks:", response.data);
        setTasks(response.data);
        setFilteredTasks(
          response.data.sort(
            (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
          )
        );
      })
      .catch((error) => {
        console.error("There was an error fetching the tasks!", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function deleteTask(id) {
    axios
      .delete(`http://localhost:3000/tasks/${id}`)
      .then((response) => {
        console.log("Task deleted:", response.data);
        setFilteredTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== id)
        );
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
      })
      .catch((error) => {
        console.error("There was an error deleting the task!", error);
      });
  }

  function updateCompleted(id) {
    let task = tasks.find((task) => task._id === id);
    const newTask = {
      title: task.title,
      description: task.description,
      completed: !task.completed,
      priority: task.priority,
      dueDate: task.dueDate,
    };
    axios
      .put(`http://localhost:3000/tasks/${id}`, newTask)
      .then((response) => {
        console.log("Task updated:", response.data);
        setFilteredTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === id ? { ...task, completed: !task.completed } : task
          )
        );
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === id ? { ...task, completed: !task.completed } : task
          )
        );
      })
      .catch((error) => {
        console.error("There was an error updating the task!", error);
      });
  }

  function getSummary() {
    axios
      .get(`http://localhost:3000/${userId}/ai/summary`)
      .then((response) => {
        setSummary(response.data.summary);
      })
      .catch((error) => {
        console.error("There was an error fetching the AI summary!", error);
      });
  }

  function handleLogout() {
    localStorage.removeItem("userId");
    navigate("/");
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">📝 To-Do Manager</h1>
        <p className="app-subtitle">Stay organized and get things done</p>
        <button className="btn btn-logout" onClick={handleLogout}>
          🚪 Logout
        </button>
      </header>

      <div className="task-controls">
        <button className="btn btn-primary" onClick={getTasks}>
          🔄 Refresh Tasks
        </button>
        <Link to={`/create-task?userId=${userId}`} className="btn btn-success">
          ➕ Create New Task
        </Link>
      </div>

      <div className="task-search">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading tasks...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <p className="empty-state-text">No tasks found</p>
          <p className="empty-state-subtext">
            Your task list is empty. Add some tasks to get started!
          </p>
        </div>
      ) : (
        <ul className="task-list">
          {filteredTasks.map((task) => (
            <li key={task._id} className="task-item">
              <div className="task-content">
                <h3 className="task-title">{task.title}</h3>
                <p className="task-description">{task.description}</p>
                <div className="task-meta">
                  <span className="task-due-date">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "No due date"}
                  </span>
                  <span className={`task-priority ${task.priority || "low"}`}>
                    {task.priority || "low"}
                  </span>
                </div>
                <span
                  className={`task-status ${
                    task.completed ? "completed" : "pending"
                  }`}
                >
                  {task.completed ? "✅ Completed" : "⏳ Pending"}
                </span>
                <Link to={`/update-task/${task._id}`} className="btn btn-edit">
                  ✏️ Edit
                </Link>
              </div>
              <div className="task-actions">
                <button
                  className="btn btn-toggle"
                  onClick={() => updateCompleted(task._id)}
                  title={
                    task.completed ? "Mark as Pending" : "Mark as Completed"
                  }
                >
                  {task.completed ? "✅ Completed" : "⏳ Pending"}
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteTask(task._id)}
                  title="Delete task"
                >
                  🗑️ Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="ai-summary">
        <h2>AI Task Summary</h2>
        <button className="btn btn-info" onClick={getSummary}>
          🤖 Generate Summary
        </button>
        {summary && (
          <div className="summary-content">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

export default Tasks;
