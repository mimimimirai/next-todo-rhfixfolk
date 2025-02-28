"use client";
import { useState, useEffect } from "react";
import { useAuth } from '../providers';
import styles from "./TodoApp.module.css";
import { FaTrash, FaPlus, FaCheck, FaRegSquare } from "react-icons/fa";
import { supabase } from '../../lib/supabase';

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTodos();
    } else {
      setTodos([]);
      setLoading(false);
    }
  }, [user]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      
      if (!user || !user.id) {
        console.error('ユーザーIDが見つかりません');
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      setTodos(data || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      if (!user || !user.id) {
        console.error('ユーザーIDが見つかりません');
        alert('ログイン情報が見つかりません。再度ログインしてください。');
        return;
      }

      // is_completedカラムを使用
      const newTodoItem = { 
        todo: newTodo, 
        user_id: user.id,
        is_completed: false
      };
      
      console.log('新しいTodoを追加:', newTodoItem);
      
      const { data, error } = await supabase
        .from('todos')
        .insert([newTodoItem])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      if (data && data.length > 0) {
        // 新しいタスクを先頭に追加
        setTodos([data[0], ...todos]);
        setNewTodo('');
      } else {
        // データが返ってこない場合は再取得
        await fetchTodos();
      }
    } catch (error) {
      console.error('Error adding todo:', error);
      alert('タスクの追加に失敗しました。もう一度お試しください。');
    }
  };

  const toggleTodo = async (id, isCompleted) => {
    try {
      // is_completedカラムを使用して更新
      const { error } = await supabase
        .from('todos')
        .update({ is_completed: !isCompleted })
        .eq('id', id);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      // UIの状態を更新
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, is_completed: !todo.is_completed } : todo
        )
      );
    } catch (error) {
      console.error('Error updating todo:', error);
      alert('タスクの更新に失敗しました。もう一度お試しください。');
    }
  };

  const deleteTodo = async (id) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('タスクの削除に失敗しました。もう一度お試しください。');
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.is_completed;
    if (filter === 'completed') return todo.is_completed;
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
                  onClick={() => toggleTodo(todo.id, todo.is_completed)}
                >
                  <span className={styles.checkboxButton}>
                    {todo.is_completed ? (
                      <FaCheck style={{ color: '#4CAF50' }} />
                    ) : (
                      <FaRegSquare style={{ color: '#4CAF50' }} />
                    )}
                  </span>
                  <span
                    className={`${styles.todoText} ${
                      todo.is_completed ? styles.completed : ""
                    }`}
                  >
                    {todo.todo}
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