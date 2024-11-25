"use client"
import React, { useEffect } from 'react';
import "./index.css"

function App() {
  const [inputValue, setInputValue] = React.useState('');
  const [todos, setTodos] = React.useState([]);
  const [filterMode, setFilterMode] = React.useState('all'); // 'all', 'incomplete', 'complete'

  // APIからTodoを取得する関数
  const fetchTodos = async () => {
    const response = await fetch('/api/todos');
    const data = await response.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos(); // コンポーネントがマウントされたときにTodoを取得
  }, []);

  const handleAddTodo = async (e) => {
    e.preventDefault();

    if (inputValue.length < 1) {
      alert('Todoを入力してください');
      return;
    }

// API ルートにデータを送信
const response = await fetch('/api/todos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ text: inputValue }),
});

if (response.ok) {
  // ステートを更新してタスクを追加
  const errorData = await response.json();
  setTodos((prevTodos) => [...prevTodos, { text: inputValue, done: false }]);
  setInputValue(''); // 入力フィールドをクリア
} else {
  const errorData = await response.json();
  console.error('Error:', errorData);
  alert(errorData.error);
  }
  };

  const handleDoneTodo = (index) => {
    setTodos(todos.map((todo, i) => {
      if (i === index) {
        return { ...todo, done: true };
      }
      return todo;
    }));
  }
  
  const handleDeleteTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  }

  const toggleFilterMode = () => {
    if (filterMode === 'all') {
      setFilterMode('incomplete');
    } else if (filterMode === 'incomplete') {
      setFilterMode('complete');
    } else {
      setFilterMode('all');
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filterMode === 'incomplete') return !todo.done;
    if (filterMode === 'complete') return todo.done;
    return true;
  });

  return (
    <div className='container'>
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
        <button onClick={(e) => {
          e.preventDefault();
          toggleFilterMode();
        }}>
          {filterMode === 'all' && '未完了のTodoのみ表示'}
          {filterMode === 'incomplete' && '完了のTodoのみ表示'}
          {filterMode === 'complete' && 'すべてのTodoを表示'}
        </button>
        <ul>
          {filteredTodos.map((todo, index) => (
            <li key={index} style={{ color: todo.done ? '#0000ff' : '#fdc33c' }}>
              {todo.text}{todo.done ? '(完了)' : ''}
              {!todo.done && (
                <button onClick={() => handleDoneTodo(index)}>完了</button>
              )}
              <button onClick={() => handleDeleteTodo(index)}>削除</button>
            </li>
          ))}
        </ul>
      </form>
    </div>
  );
};

export default App;