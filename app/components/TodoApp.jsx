"use client";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import "../index.css";

export default function TodoApp({ initialTodos, userId }) {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState(initialTodos || []);
  const [filterMode, setFilterMode] = useState("all");

  const handleSignOut = async (e) => {
    e.preventDefault();
    await signOut({ callbackUrl: '/signin' });
  };

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
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Todoリスト</h1>
        <button onClick={handleSignOut} style={{ padding: '8px 16px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          ログアウト
        </button>
      </div>
      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        />
        <button type="submit">追加</button>
        <button onClick={toggleFilterMode}>
          {filterMode === "all" && "未完了のTodoのみ表示"}
          {filterMode === "incomplete" && "完了のTodoのみ表示"}
          {filterMode === "complete" && "すべてのTodoを表示"}
        </button>
        <ul>
          {filteredTodos.map((todo) => (
            <li key={todo.id} style={{ color: todo.done ? "#0000ff" : "#fdc33c" }}>
              {todo.text}
              {todo.done ? "(完了)" : ""}
              {!todo.done && (
                <button onClick={(e) => handleDoneTodo(e, todo.id)}>完了</button>
              )}
              <button onClick={(e) => handleDeleteTodo(e, todo.id)}>削除</button>
            </li>
          ))}
        </ul>
      </form>
    </div>
  );
} 