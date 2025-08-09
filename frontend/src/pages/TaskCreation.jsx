import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function TaskCreation() {
  const navigate = useNavigate();

  function createTask(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newTask = {
      title: formData.get("title"),
      description: formData.get("description"),
    };
    axios
      .post(`${import.meta.env.VITE_API}/tasks`, newTask)
      .then((response) => {
        console.log("Task created:", response.data);
        navigate("/");
      })
      .catch((error) => {
        console.error("There was an error creating the task!", error);
      });
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
          <div className="form-actions">
            <button type="submit" className="btn btn-success">
              ✅ Create Task
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

export default TaskCreation;
