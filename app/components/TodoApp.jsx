"use client";
import { useEffect, useState } from "react";
import styles from "./TodoApp.module.css";
import { useSession } from "next-auth/react";
import { FaTrash, FaPlus, FaCheck, FaRegSquare } from "react-icons/fa";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      console.log("セッションがありません");
      setTodos([]);
      return;
    }

    if (session?.user?.id) {
      // IDが数値であることを確認
      const userId = parseInt(session.user.id);
      if (!isNaN(userId)) {
        console.log("セッションが有効です。TODOを取得します", userId);
        fetchTodos();
      }
    }
  }, [session]);

  const fetchTodos = async () => {
    try {
      console.log("Fetching todos for user:", session?.user?.id);
      
      const response = await fetch("/api/todos", {
        credentials: "include" // セッションCookieを含める
      });
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API error:", response.status, errorData);
        setTodos([]);
        return;
      }
      
      const data = await response.json();
      console.log("Fetched todos:", data);
      
      // データが配列であることを確認
      if (Array.isArray(data)) {
        setTodos(data);
      } else if (data && Array.isArray(data.todos)) {
        // APIが { todos: [...] } の形式で返す場合
        setTodos(data.todos);
      } else {
        console.error("API did not return an array:", data);
        setTodos([]); // 空の配列をセット
      }
    } catch (error) {
      console.error("Failed to fetch todos:", error);
      setTodos([]); // エラー時は空の配列をセット
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      console.log("Adding todo:", text); // デバッグ用

      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
        credentials: "include" // セッションCookieを含める
      });

      console.log("Response status:", response.status); // デバッグ用

      if (response.ok) {
        const newTodo = await response.json();
        console.log("New todo created:", newTodo);
        setTodos(prevTodos => [newTodo, ...prevTodos]); // 新しいTODOを先頭に追加
        setText("");
      } else {
        const errorData = await response.json();
        console.error("Failed to add todo:", errorData);
        alert(`TODOの追加に失敗しました: ${errorData.error || '不明なエラー'}`);
      }
    } catch (error) {
      console.error("Exception when adding todo:", error);
      alert("TODOの追加中にエラーが発生しました");
    }
  };

  const toggleTodo = async (id) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ done: !todo.done }),
        credentials: "include" // セッションCookieを含める
      });

      if (response.ok) {
        setTodos(
          todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
        );
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to toggle todo:", response.status, errorData);
      }
    } catch (error) {
      console.error("Exception when toggling todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
        credentials: "include" // セッションCookieを含める
      });

      if (response.ok) {
        setTodos(todos.filter((t) => t.id !== id));
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to delete todo:", response.status, errorData);
      }
    } catch (error) {
      console.error("Exception when deleting todo:", error);
    }
  };

  const filteredTodos = Array.isArray(todos) 
    ? todos.filter(todo => {
        if (filter === 'all') return true;
        if (filter === 'active') return !todo.done;
        if (filter === 'completed') return todo.done;
        return true;
      })
    : [];

  return (
    <div className={styles.container}>
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          addTodo(e);
        }} 
        className={styles.form}
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="新しいタスクを入力..."
          className={styles.input}
        />
        <button 
          type="submit" 
          className={styles.addButton}
          onClick={(e) => {
            // ボタンクリック時にもフォーム送信を確実に実行
            if (!e.isDefaultPrevented()) {
              e.preventDefault();
              addTodo(e);
            }
          }}
        >
          <FaPlus style={{ color: 'white', fontSize: '1.5rem' }} />
        </button>
      </form>
      
      <div className={styles.filterContainer}>
        <button 
          className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
          onClick={() => setFilter('all')}
          aria-label="すべてのタスクを表示"
          title="すべてのタスクを表示"
        >
          すべて
        </button>
        <button 
          className={`${styles.filterButton} ${filter === 'active' ? styles.active : ''}`}
          onClick={() => setFilter('active')}
          aria-label="未完了のタスクのみ表示"
          title="未完了のタスクのみ表示"
        >
          未完了
        </button>
        <button 
          className={`${styles.filterButton} ${filter === 'completed' ? styles.active : ''}`}
          onClick={() => setFilter('completed')}
          aria-label="完了済みのタスクのみ表示"
          title="完了済みのタスクのみ表示"
        >
          完了済み
        </button>
      </div>

      <ul className={styles.todoList}>
        {filteredTodos.map((todo) => (
          <li key={todo.id} className={styles.todoItem}>
            <div 
              className={styles.todoContent}
              onClick={() => toggleTodo(todo.id)}
            >
              <button
                className={styles.checkboxButton}
                aria-label={todo.done ? "未完了に戻す" : "完了にする"}
                title={todo.done ? "未完了に戻す" : "完了にする"}
              >
                {todo.done ? (
                  <FaCheck style={{ color: '#4CAF50' }} />
                ) : (
                  <FaRegSquare style={{ color: '#4CAF50' }} />
                )}
              </button>
              <span
                className={`${styles.todoText} ${
                  todo.done ? styles.completed : ""
                }`}
              >
                {todo.text}
              </span>
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
              className={styles.deleteButton}
              aria-label="削除"
              title="削除"
            >
              <FaTrash style={{ color: 'white' }} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
} 