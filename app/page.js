'use client';

import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
//import styles from './layout.module.css';


export default function Home() {
  const [inputValue, setInputValue] = React.useState('');
  const [todos, setTodos] = React.useState([]);
  const [filterMode, setFilterMode] = React.useState('all'); // 'all', 'incomplete', 'complete'
        

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    setTodos(storedTodos);
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = (e) => {
    e.preventDefault();

    if (inputValue.length < 1) {
      alert('Todoを入力してください');
      return;
    }
    setTodos([...todos, { text: inputValue, done: false }]);
    setInputValue('');
  };

  const handleDoneTodo = (index) => {
    setTodos(todos.map((todo, i) => {
      if (i === index) {
        return { ...todo, done: true };
      }
      return todo;
    }));
  };

  const handleDeleteTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

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
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" /> 
      </Head>
     
      <main>
      <div id="root" className={styles.container}>
        <h1 className={styles.title}>
          Todoリスト
        </h1>
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
      </main>
      

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/img/logo.svg" alt="Vercel" className={styles.logo} />
        </a>
      </footer>

      <style jsx>
        {`
        main {
          padding: 0;
          flex: 1;
          display: ;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px; 
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family:
            Menlo,
            Monaco,
            Lucida Console,
            Liberation Mono,
            DejaVu Sans Mono,
            Bitstream Vera Sans Mono,
            Courier New,
            monospace;
        }
       `}
      </style>

      <style jsx global>{`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`}</style>
      </div>
  );
}
