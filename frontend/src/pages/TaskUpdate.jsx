import axios from "axios";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function TaskUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [dueDate, setDueDate] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");
    if (!userIdFromStorage) {
      navigate("/");
      return;
    }
    setUserId(userIdFromStorage);

    axios
      .get(`http://localhost:3000/tasks/${id}`)
      .then((response) => {
        setTask(response.data);
        setTitle(response.data.title || "");
        setDescription(response.data.description || "");
        setPriority(response.data.priority || "low");
        setDueDate(
          response.data.dueDate
            ? new Date(response.data.dueDate).toISOString().split("T")[0]
            : ""
        );
      })
      .catch((error) => {
        console.error("There was an error fetching the task!", error);
      });
  }, [id, navigate]);

  function updateTask(event) {
    event.preventDefault();
    const updatedTask = {
      title: title,
      description: description,
      priority: priority,
      dueDate: dueDate,
    };
    axios
      .put(`http://localhost:3000/tasks/${id}`, updatedTask)
      .then((response) => {
        console.log("Task updated:", response.data);
        navigate(`/tasks/${userId}`);
      })
      .catch((error) => {
        console.error("There was an error updating the task!", error);
      });
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">✏️ Update Task</h1>
        <p className="app-subtitle">Modify the details of your task</p>
      </header>

      <div className="task-creation-container">
        <form onSubmit={updateTask} className="task-form">
          <div className="form-group">
            <label htmlFor="title">Task Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description..."
              className="form-textarea"
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="priority">Priority:</label>
            <select
              id="priority"
              name="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="form-select"
            >
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
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-success">
              ✅ Update Task
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

export default TaskUpdate;
