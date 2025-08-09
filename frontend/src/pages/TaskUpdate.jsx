import axios from "axios";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function TaskUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API}/tasks/${id}`)
      .then((response) => {
        setTask(response.data);
        setTitle(response.data.title || "");
        setDescription(response.data.description || "");
      })
      .catch((error) => {
        console.error("There was an error fetching the task!", error);
      });
  }, [id]);

  function updateTask(event) {
    event.preventDefault();
    const updatedTask = {
      title: title,
      description: description,
    };
    axios
      .put(`${import.meta.env.VITE_API}/tasks/${id}`, updatedTask)
      .then((response) => {
        console.log("Task updated:", response.data);
        navigate("/");
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
          <div className="form-actions">
            <button type="submit" className="btn btn-success">
              ✅ Update Task
            </button>
            <Link to="/" className="btn btn-secondary">
              ⬅️ Back to Tasks
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskUpdate;
