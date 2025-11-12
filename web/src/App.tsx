import React from 'react';
import ItemList from './components/ItemList';
import './App.css'

function App() {
  return (
    <>
      <div className="app">
        <header className="header">
          <h1>Productos — TD Test</h1>
        </header>
        <main className="container">
          <ItemList />
        </main>
        <footer className="footer">
          <small>Demo: React + Vite — consume API local</small>
        </footer>
      </div>
    </>
  );
}

export default App
