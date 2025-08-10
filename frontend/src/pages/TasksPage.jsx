import { useParams } from "react-router-dom";
import api from "../api";
import React, { useState, useEffect } from "react";

function TasksPage() {
  const { taskId } = useParams();
  const [taskDetails, setTaskDetails] = useState(null);

  useEffect(() => {
    getTaskDetails();
  }, [taskId]);

  function getTaskDetails() {
    api
      .get(`/tasks/${taskId}`)
      .then((response) => {
        setTaskDetails(response.data);
        console.log("Task details fetched successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching task details:", error);
      });
  }

  return (
    <div>
      <h1>Task Details</h1>
      {taskDetails ? (
        <div>
          <h2>{taskDetails.title}</h2>
          <p>{taskDetails.description}</p>
          <p>Status: {taskDetails.completed ? "✅ Completed" : "⏳ Pending"}</p>
          <p>Due Date: {new Date(taskDetails.dueDate).toLocaleDateString()}</p>
        </div>
      ) : (
        <p>Loading task details...</p>
      )}
    </div>
  );
}

export default TasksPage;
