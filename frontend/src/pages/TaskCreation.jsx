import api from "../api";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

function TaskCreation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const userIdFromParams = searchParams.get("userId");
    const userIdFromStorage = localStorage.getItem("userId");

    if (userIdFromParams && userIdFromParams === userIdFromStorage) {
      setUserId(userIdFromParams);
    } else if (userIdFromStorage) {
      setUserId(userIdFromStorage);
    } else {
      navigate("/");
    }
  }, [searchParams, navigate]);

  function createTask(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newTask = {
      title: formData.get("title"),
      description: formData.get("description"),
      priority: formData.get("priority"),
      dueDate: formData.get("dueDate"),
      userId: userId,
    };
    api
      .post(`/tasks`, newTask)
      .then((response) => {
        console.log("Task created:", response.data);
        navigate(`/tasks/${userId}`);
      })
      .catch((error) => {
        console.error("There was an error creating the task!", error);
      });
  }

  if (!userId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">➕ Create New Task</h1>
        <p className="app-subtitle">Add a new task to your to-do list</p>
      </header>

      <div className="task-creation-container">
        <form onSubmit={createTask} className="task-form">
          <div className="form-group">
            <label htmlFor="title">Task Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              placeholder="Enter task title..."
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              required
              placeholder="Enter task description..."
              className="form-textarea"
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="priority">Priority:</label>
            <select id="priority" name="priority" className="form-select">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="dueDate">Due Date:</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              className="form-input"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-success">
              ✅ Create Task
            </button>
            <Link to={`/tasks/${userId}`} className="btn btn-secondary">
              ⬅️ Back to Tasks
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskCreation;
