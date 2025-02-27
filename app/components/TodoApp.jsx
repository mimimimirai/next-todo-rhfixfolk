"use client";
import { useState, useEffect } from "react";
import { useAuth } from '../providers';
import { supabase } from '../../lib/supabase';
import styles from "./TodoApp.module.css";
import { FaTrash, FaPlus, FaCheck, FaRegSquare } from "react-icons/fa";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTodos(data || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([
          { title: newTodo, user_id: user.id, completed: false }
        ])
        .select();

      if (error) throw error;
      setTodos([...data, ...todos]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !completed })
        .eq('id', id);

      if (error) throw error;
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  if (!user) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>ログインしてください</h1>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Todoリスト</h1>

      <form onSubmit={addTodo} className={styles.form}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="新しいタスクを入力..."
          className={styles.input}
        />
        <button type="submit" className={styles.addButton}>
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

      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <ul className={styles.todoList}>
          {filteredTodos.length === 0 ? (
            <p>タスクがありません</p>
          ) : (
            filteredTodos.map((todo) => (
              <li key={todo.id} className={styles.todoItem}>
                <div 
                  className={styles.todoContent}
                  onClick={() => toggleTodo(todo.id, todo.completed)}
                >
                  <span className={styles.checkboxButton}>
                    {todo.completed ? (
                      <FaCheck style={{ color: '#4CAF50' }} />
                    ) : (
                      <FaRegSquare style={{ color: '#4CAF50' }} />
                    )}
                  </span>
                  <span
                    className={`${styles.todoText} ${
                      todo.completed ? styles.completed : ""
                    }`}
                  >
                    {todo.title}
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
            ))
          )}
        </ul>
      )}
    </div>
  );
} 