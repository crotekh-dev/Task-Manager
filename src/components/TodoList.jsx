import React, { useEffect, useState } from "react";
import "./TodoList.css";
import {
  FaArrowAltCircleUp,
  FaArrowAltCircleDown,
  FaHome,
  FaStar,
  FaRegStar,
  FaCalendarDay,
  FaCheckCircle,
} from "react-icons/fa";
import { IoAddCircle } from "react-icons/io5";
import { BsFillTrash3Fill } from "react-icons/bs";
import { MdClearAll } from "react-icons/md";
import { getTasks, saveTasks, clearTasks } from "../utils/storage";

const Todolist = () => {
  const [tasks, setTasks] = useState(() => {
    return getTasks();
  });
  const [newTask, setNewTask] = useState("");
  const [addErrorAlert, setAddErrorAlert] = useState("");
  const [addAlert, setAddAlert] = useState("");
  const [deleteAlert, setDeleteAlert] = useState("");
  const [clearAlert, setClearAlert] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all");
  const [notification, setNotification] = useState(null);

  function showNotification(message, type = "success") {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((prev) => prev ? { ...prev, isExiting: true } : null);
      setTimeout(() => setNotification(null), 300);
    }, 2000);
  }

  function addTask() {
    const trimmedTask = newTask.trim();

    if (!trimmedTask) {
      showNotification("Please enter a task", "error");
      return;
    }

    setTasks([
      ...tasks,
      {
        id: Date.now() + Math.random(),
        text: trimmedTask,
        completed: false,
        important: false,
      },
    ]);
    setNewTask("");
    showNotification("Task added successfully", "success");
  }

  function toggleComplete(index) {
    const updatedTasks = tasks.map((task, i) => {
      if (i === index) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function toggleImportant(index) {
    const updatedTasks = tasks.map((task, i) => {
      if (i === index) {
        return { ...task, important: !task.important };
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function deleteTask(index) {
    const deletedTask = tasks[index];
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    showNotification(`"${deletedTask.text}" deleted`, "warning");
  }

  function moveTaskUp(index) {
    if (index > 0) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index - 1]] = [
        updatedTasks[index - 1],
        updatedTasks[index],
      ];
      setTasks(updatedTasks);
    }
  }

  function moveTaskDown(index) {
    if (index < tasks.length - 1) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index + 1]] = [
        updatedTasks[index + 1],
        updatedTasks[index],
      ];
      setTasks(updatedTasks);
    }
  }

  const clearAll = () => {
    setTasks([]);
    showNotification("All tasks cleared", "warning");
    clearTasks();
  };

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  function handleInputChange(event) {
    setNewTask(event.target.value);
  }

  function startEditing(task, index) {
    setEditingId(task.id ?? index);
    setEditText(task.text);
  }

  function saveEdit(index) {
    const trimmedValue = editText.trim();

    if (!trimmedValue) {
      showNotification("Task cannot be empty", "error");
      return;
    }

    setTasks(
      tasks.map((task, i) => (i === index ? { ...task, text: trimmedValue } : task)),
    );
    setEditingId(null);
    setEditText("");
    showNotification("Task updated", "success");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditText("");
  }

  function handleEditKeyDown(event, index) {
    if (event.key === "Enter") {
      event.preventDefault();
      saveEdit(index);
    } else if (event.key === "Escape") {
      cancelEdit();
    }
  }

  function markAllComplete() {
    if (tasks.length === 0) {
      return;
    }

    const allCompleted = tasks.every((task) => task.completed);
    setTasks(tasks.map((task) => ({ ...task, completed: !allCompleted })));
  }

  const allCompleted = tasks.length > 0 && tasks.every((task) => task.completed);
  const visibleTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    if (filter === "important") return task.important;
    return true;
  });

  return (
    <>
      <div className="App">
        <div className="panel-grid">
          <aside className="sidebar">
            <div className="brand-card">
              <div className="brand-icon">✓</div>
              <div>
                <p className="brand-label">TodoList</p>
                <p className="brand-subtitle">Stay focused, stay productive</p>
              </div>
            </div>

            <nav className="side-nav">
              <button
                type="button"
                className={filter === "all" ? "nav-item active" : "nav-item"}
                onClick={() => setFilter("all")}
              >
                <FaHome />
                <span>All Tasks</span>
              </button>
              <button type="button" className="nav-item disabled">
                <FaCalendarDay />
                <span>Today</span>
              </button>
              <button
                type="button"
                className={filter === "important" ? "nav-item active" : "nav-item"}
                onClick={() => setFilter("important")}
              >
                <FaStar />
                <span>Important</span>
              </button>
              <button
                type="button"
                className={filter === "completed" ? "nav-item active" : "nav-item"}
                onClick={() => setFilter("completed")}
              >
                <FaCheckCircle />
                <span>Completed</span>
              </button>
            </nav>

            <div className="sidebar-note">
              <p className="quote">“Small steps every day lead to big results.”</p>
              <span className="note-footer">Day by day, progress builds.</span>
            </div>
          </aside>

          <main className="main-view">
            <header className="top-bar">
              <div>
                <p className="page-label">All Tasks</p>
                <h2 className="page-title">Your Task Collection</h2>
              </div>
              <button type="button" className="header-add-btn" onClick={addTask}>
                <IoAddCircle /> Add Task
              </button>
            </header>

            <div className="status-strip">
              <div>{tasks.length} tasks left</div>
              <div>{tasks.filter((task) => task.completed).length} done</div>
            </div>

            <section className="input-panel">
              <input
                type="text"
                placeholder="What do you need to do?"
                value={newTask}
                onChange={handleInputChange}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addTask();
                  }
                }}
              />
              <button type="button" onClick={addTask} className="primary-btn">
                Add
              </button>
            </section>

            <section className="task-card-list">
              {visibleTasks.length === 0 ? (
                <div className="empty-state">
                  {filter === "completed"
                    ? "No completed tasks yet."
                    : filter === "pending"
                      ? "No pending tasks. Add one to get started."
                      : filter === "important"
                        ? "No important tasks yet."
                        : "Your task list is empty. Add a task above."}
                </div>
              ) : (
                visibleTasks.map((task, index) => {
                  const taskIndex = tasks.findIndex((item) => item.id === task.id);
                  const isEditing = editingId === task.id;

                  return (
                    <article className="task-card" key={task.id ?? `${task.text}-${index}`}>
                      <div className="task-card-main">
                        <label className="task-checkbox">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleComplete(taskIndex)}
                          />
                          <span />
                        </label>
                        <div className="task-content">
                          {isEditing ? (
                            <div className="edit-row">
                              <input
                                type="text"
                                value={editText}
                                onChange={(event) => setEditText(event.target.value)}
                                onKeyDown={(event) => handleEditKeyDown(event, taskIndex)}
                              />
                              <button type="button" onClick={() => saveEdit(taskIndex)}>
                                Save
                              </button>
                              <button type="button" onClick={cancelEdit}>
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <>
                              <p className={task.completed ? "task-title completed" : "task-title"}>
                                {task.text}
                              </p>
                              <span className="task-meta">No due date</span>
                            </>
                          )}
                        </div>
                      </div>
                      {!isEditing && (
                        <div className="task-card-actions">
                          <button type="button" onClick={() => startEditing(task, taskIndex)}>
                            Edit
                          </button>
                          <button type="button" onClick={() => moveTaskUp(taskIndex)}>
                            <FaArrowAltCircleUp />
                          </button>
                          <button type="button" onClick={() => moveTaskDown(taskIndex)}>
                            <FaArrowAltCircleDown />
                          </button>
                          <button type="button" onClick={() => toggleImportant(taskIndex)}>
                            {task.important ? <FaStar /> : <FaRegStar />}
                          </button>
                          <button type="button" onClick={() => deleteTask(taskIndex)}>
                            <BsFillTrash3Fill />
                          </button>
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </section>
          </main>
        </div>
      </div>

      <nav className="mobile-nav">
        <button type="button" className={filter === "all" ? "mobile-nav-btn active" : "mobile-nav-btn"} onClick={() => setFilter("all")}> 
          <FaHome />
          <span>All</span>
        </button>
        <button type="button" className="mobile-nav-btn disabled">
          <FaCalendarDay />
          <span>Today</span>
        </button>
        <button type="button" className={filter === "important" ? "mobile-nav-btn active" : "mobile-nav-btn"} onClick={() => setFilter("important")}> 
          <FaStar />
          <span>Important</span>
        </button>
        <button type="button" className={filter === "completed" ? "mobile-nav-btn active" : "mobile-nav-btn"} onClick={() => setFilter("completed")}> 
          <FaCheckCircle />
          <span>Done</span>
        </button>
      </nav>

      {notification && (
        <div className="notification-center">
          <div className={`notification ${notification.type} ${notification.isExiting ? "exit" : ""}`}>
            {notification.message}
          </div>
        </div>
      )}

      {addAlert && <div className="add-alert"> {addAlert}</div>}
      {addErrorAlert && <div className="adderror-alert"> {addErrorAlert}</div>}
      {deleteAlert && <div className="delete-alert"> {deleteAlert}</div>}
      {clearAlert && <div className="clear-alert"> {clearAlert}</div>}
    </>
  );
};

export default Todolist;
