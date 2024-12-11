"use client";
import { useEffect, useState } from "react";
import "../index.css";
import SessionCheck from './SessionCheck'
import AdminCheck from './AdminCheck'

export default function TodoApp() {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);
  const [filterMode, setFilterMode] = useState("all");
  const [token, setToken] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers([
      { id: 1, name: "User1" },
      { id: 2, name: "User2" },
      { id: 3, name: "User3" },
    ]);
  }, []);

  useEffect(() => {
    if (users.length > 0 && !selectedUser) {
      setSelectedUser(users[0]);
    }
  }, [users, selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      const getToken = async () => {
        try {
          const userData = {
            user: {
              id: Number(selectedUser.id),
              name: selectedUser.name
            }
          };
          console.log("Sending user data:", userData);

          const response = await fetch("/api/auth/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          });

          const data = await response.json();
          console.log("Token response:", data);
          
          if (!response.ok) {
            throw new Error(data.error || 'Token generation failed');
          }
          
          if (data.token) {
            console.log("Setting token");
            setToken(data.token);
          } else {
            throw new Error('No token received');
          }
        } catch (error) {
          console.error("Token fetch error:", error);
          setToken('');
        }
      };
      
      getToken();
    } else {
      setToken('');
    }
  }, [selectedUser]);

  const fetchTodos = async () => {
    try {
      const response = await fetch("/api/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
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
    if (token) {
      const loadTodos = async () => {
        await fetchTodos();
      };
      loadTodos();
    }
  }, [token]);

  const handleAddTodo = async (e) => {
    e.preventDefault();

    if (inputValue.length < 1) {
      alert("Todoを入力してください");
      return;
    }

    if (!token) {
      console.error("No token available");
      alert("認証エラー: トークンがありません");
      return;
    }

    try {
      const requestData = {
        text: inputValue
      };
      console.log("Sending request:", {
        token,
        data: requestData
      });

      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      console.log("Response received:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers)
      });

      // レスポンスの内容を文字列として取得
      const responseText = await response.text();
      console.log("Raw response:", responseText);

      // JSONとしてパースを試みる
      let data;
      try {
        data = JSON.parse(responseText);
        console.log("Parsed response data:", data);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error(`Invalid JSON response: ${responseText}`);
      }

      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      console.log("Todo created successfully:", data);
      setTodos((prevTodos) => [...prevTodos, data]);
      setInputValue("");
    } catch (error) {
      const errorDetails = {
        name: error.name,
        message: error.message,
        stack: error.stack,
        toString: error.toString()
      };
      console.error("Error adding todo:", errorDetails);
      alert(`Todoの追加に失敗しました: ${error.message || "不明なエラー"}`);
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      const response = await fetch("/api/todos", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, completed }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const updatedTodo = await response.json();
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
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
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
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

  const handleUserChange = (user) => {
    setSelectedUser(user);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filterMode === "incomplete") return !todo.done;
    if (filterMode === "complete") return todo.done;
    return true;
  });

  return (
    <div className="container">
      <SessionCheck />
      <AdminCheck />
      <div>
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => handleUserChange(user)}
            className={`user-button ${selectedUser?.id === user.id ? 'selected' : ''}`}
          >
            {user.name}
          </button>
        ))}
      </div>
      {selectedUser && <p>Selected User ID: {selectedUser.id}</p>}
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
        <button onClick={toggleFilterMode}>
          {filterMode === "all" && "未完了のTodoのみ表示"}
          {filterMode === "incomplete" && "完了のTodoのみ表示"}
          {filterMode === "complete" && "すべてのTodoを表示"}
        </button>
        <ul>
          {filteredTodos.map((todo, index) => (
            <li key={index} style={{ color: todo.done ? "#0000ff" : "#fdc33c" }}>
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