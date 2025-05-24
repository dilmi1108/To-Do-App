import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { motion } from 'framer-motion';
import './App.css';

const priorities = ['Low', 'Medium', 'High'];

// Helper to compare dates without time
const isSameDay = (d1, d2) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const addTask = () => {
    if (input.trim() === '' || !dueDate) return;

    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0); // Normalize date

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: input.trim(),
        completed: false,
        priority,
        dueDate: due.toISOString(),
      },
    ]);

    setInput('');
    setPriority('Medium');
    setDueDate('');
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'All') return true;
    if (filter === 'Completed') return task.completed;
    if (filter === 'Pending') return !task.completed;
    return true;
  });

  const priorityColor = (p) => {
    switch (p) {
      case 'High': return '#e74c3c';
      case 'Medium': return '#f39c12';
      default: return '#2ecc71';
    }
  };

  return (
    <div className="app">
      <h1>🎓 Student To-Do App</h1>

      <motion.div className="calendar-container"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileContent={({ date, view }) => {
            const hasTask = tasks.some(task =>
              isSameDay(new Date(task.dueDate), date)
            );
            return view === 'month' && hasTask ? (
              <div className="dot" />
            ) : null;
          }}
          tileClassName={({ date, view }) => {
            const hasTask = tasks.some(task =>
              isSameDay(new Date(task.dueDate), date)
            );
            return view === 'month' && hasTask ? 'highlight' : null;
          }}
        />
      </motion.div>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter your task..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
        />

        <select value={priority} onChange={e => setPriority(e.target.value)}>
          {priorities.map(p => (
            <option key={p} value={p}>{p} Priority</option>
          ))}
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />

        <button onClick={addTask} className="add-btn">Add</button>
      </div>

      <div className="filter-section">
        <button className={filter === 'All' ? 'active' : ''} onClick={() => setFilter('All')}>All</button>
        <button className={filter === 'Pending' ? 'active' : ''} onClick={() => setFilter('Pending')}>Pending</button>
        <button className={filter === 'Completed' ? 'active' : ''} onClick={() => setFilter('Completed')}>Completed</button>
      </div>

      <ul className="task-list">
        {filteredTasks.length === 0 && <p className="no-tasks">No tasks here!</p>}

        {filteredTasks.map(({ id, text, completed, priority, dueDate }) => (
          <li key={id} className={`task-item ${completed ? 'completed' : ''}`}>
            <label>
              <input
                type="checkbox"
                checked={completed}
                onChange={() => toggleComplete(id)}
              />
              <span className="task-text">{text}</span>
            </label>

            <div className="task-info">
              <span
                className="priority"
                style={{ backgroundColor: priorityColor(priority) }}
                title={`${priority} priority`}
              >
                {priority[0]}
              </span>

              {dueDate && (
                <span className="due-date" title={`Due on ${dueDate}`}>
                  📅 {new Date(dueDate).toLocaleDateString()}
                </span>
              )}

              <button className="delete-btn" onClick={() => deleteTask(id)}>❌</button>
            </div>
          </li>
        ))}
      </ul>

      {tasks.some(task => task.completed) && (
        <button className="clear-btn" onClick={clearCompleted}>
          Clear Completed Tasks
        </button>
      )}
    </div>
  );
}

export default App;
