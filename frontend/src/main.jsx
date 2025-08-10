import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Tasks from "./pages/Tasks.jsx";
import App from "./App.jsx";
import TaskCreation from "./pages/TaskCreation.jsx";
import TaskUpdate from "./pages/TaskUpdate.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/tasks/:userId" element={<Tasks />} />
        <Route path="/create-task" element={<TaskCreation />} />
        <Route path="/update-task/:id" element={<TaskUpdate />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
