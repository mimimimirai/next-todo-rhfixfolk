"use client";
import { useEffect, useState } from "react";
import "./index.css";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);
  const [filterMode, setFilterMode] = useState("all"); // 'all', 'incomplete', 'complete'

  // APIからTodoを取得する関数
  const fetchTodos = async () => {
    try {
      const response = await fetch("/api/todos");
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

  useEffect(() => {
    const loadTodos = async () => {
      await fetchTodos();
    };
    loadTodos();
  }, []);

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
        body: JSON.stringify({ text: inputValue }),
      });

      if (response.ok) {
        const todoData = await response.json();
        setTodos((prevTodos) => [...prevTodos, todoData]);
        setInputValue("");
      } else {
        const errorText = await response.text();
        console.error("Error:", errorText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      const response = await fetch("/api/todos", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, completed }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const updatedTodo = await response.json();
      setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));
    } catch (error) {
      console.error("Toggle complete error:", error);
    }
  };

  const handleDoneTodo = (e, id) => {
    e.preventDefault();
    console.log(id);
    console.log(todos)
    const todo = todos.find(todo => todo.id === id);
    console.log(todo)
    handleToggleComplete(id, !todo.done);
  };

  const handleDeleteTodo = async (e, id) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/todos", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({id}),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setTodos(todos.filter(todo => todo.id !== id));
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
      <h1>Todoリスト</h1>
      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        />
        <button type="submit">追加</button>
        <button
          onClick={//(e) = {
            //e.preventDefault();
            toggleFilterMode
          //}
        }
        >
          {filterMode === "all" && "未完了のTodoのみ表示"}
          {filterMode === "incomplete" && "完了のTodoのみ表示"}
          {filterMode === "complete" && "すべてのTodoを表示"}
        </button>
        <ul>
          {filteredTodos.map((todo, index) => (
            <li
              key={index}
              style={{ color: todo.done ? "#0000ff" : "#fdc33c" }}
            >
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

export default App;
