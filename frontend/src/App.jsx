import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchString, setSearchString] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(searchString.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchString.toLowerCase()))
      );
      setFilteredTasks(filteredTasks);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchString, tasks]);

  useEffect(() => {
    getTasks();
  }, []);

  function getTasks() {
    setLoading(true);
    axios
      .get("http://localhost:3000/tasks")
      .then((response) => {
        console.log("Tasks:", response.data);
        setTasks(response.data);
        setFilteredTasks(response.data);
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
        getTasks();
      })
      .catch((error) => {
        console.error("There was an error deleting the task!", error);
      });
  }

  function updateCompleted(id) {
    let task = tasks.find((task) => task.id === id);
    const newTask = {
      ...task,
      completed: !task.completed,
    };
    axios
      .put(`http://localhost:3000/tasks/${id}`, newTask)
      .then((response) => {
        console.log("Task updated:", response.data);
        getTasks();
      })
      .catch((error) => {
        console.error("There was an error updating the task!", error);
      });
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">📝 To-Do Manager</h1>
        <p className="app-subtitle">Stay organized and get things done</p>
      </header>

      <div className="task-controls">
        <button className="btn btn-primary" onClick={getTasks}>
          🔄 Refresh Tasks
        </button>
        <Link to="/create-task" className="btn btn-success">
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
            <li key={task.id} className="task-item">
              <div className="task-content">
                <h3 className="task-title">{task.title}</h3>
                <p className="task-description">{task.description}</p>
                <span
                  className={`task-status ${
                    task.completed ? "completed" : "pending"
                  }`}
                >
                  {task.completed ? "✅ Completed" : "⏳ Pending"}
                </span>
                <Link to={`/update-task/${task.id}`} className="btn btn-edit">
                  ✏️ Edit
                </Link>
              </div>
              <div className="task-actions">
                <button
                  className="btn btn-toggle"
                  onClick={() => updateCompleted(task.id)}
                  title={task.completed ? "Mark as Pending" : "Mark as Completed"}
                >
                  {task.completed ? "✅ Completed" : "⏳ Pending"}
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteTask(task.id)}
                  title="Delete task"
                >
                  🗑️ Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
