"use client";
import { useEffect, useState } from "react";
import styles from "./TodoApp.module.css";

export default function TodoApp({ initialTodos, userId }) {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState(initialTodos || []);
  const [filterMode, setFilterMode] = useState("all");

  const fetchTodos = async () => {
    try {
      const response = await fetch(`/api/todos?userId=${userId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setTodos(data);
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();

    if (inputValue.length < 1) {
      alert("Todoを入力してください");
      return;
    }

    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          text: inputValue,
          userId: userId 
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setTodos((prevTodos) => [...prevTodos, data]);
      setInputValue("");
    } catch (error) {
      console.error("Error adding todo:", error);
      alert("Todoの追加に失敗しました");
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      const response = await fetch(`/api/todos/${id}?userId=${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setTodos(todos.map((todo) => (todo.id === id ? data.todo : todo)));
    } catch (error) {
      console.error("Toggle complete error:", error);
    }
  };

  const handleDoneTodo = (e, id) => {
    e.preventDefault();
    handleToggleComplete(id, !todos.find(todo => todo.id === id).done);
  };

  const handleDeleteTodo = async (e, id) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/todos/${id}?userId=${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Delete todo error:", error);
    }
  };

  const toggleFilterMode = (e) => {
    e.preventDefault();
    if (filterMode === "all") {
      setFilterMode("incomplete");
    } else if (filterMode === "incomplete") {
      setFilterMode("complete");
    } else {
      setFilterMode("all");
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filterMode === "incomplete") return !todo.done;
    if (filterMode === "complete") return todo.done;
    return true;
  });

  return (
    <div className={styles.todoContainer}>
      <h1 className={styles.title}>Todoリスト</h1>
      <div className={styles.form}>
        <button type="button" onClick={toggleFilterMode} className={styles.filterButton}>
          {filterMode === "all" && "未完了のTodoのみ表示"}
          {filterMode === "incomplete" && "完了のTodoのみ表示"}
          {filterMode === "complete" && "すべてのTodoを表示"}
        </button>
        <form className={styles.inputForm} onSubmit={handleAddTodo}>
          <div className={styles.inputWrapper}>
            <div className={styles.inputGroup}>
              <input
                className={styles.input}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="新しいTodoを入力..."
              />
            </div>
            <button type="submit" className={styles.button}>
              追加
            </button>
          </div>
        </form>
        <ul className={styles.todoList}>
          {filteredTodos.map((todo) => (
            <li key={todo.id} className={styles.todoItem}>
              <span className={`${styles.todoText} ${todo.done ? styles.completed : styles.pending}`}>
                {todo.text}
                {todo.done && " (完了)"}
              </span>
              <div className={styles.buttonGroup}>
                {!todo.done && (
                  <button
                    type="button"
                    onClick={(e) => handleDoneTodo(e, todo.id)}
                    className={styles.completeButton}
                  >
                    完了
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => handleDeleteTodo(e, todo.id)}
                  className={styles.deleteButton}
                >
                  削除
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 