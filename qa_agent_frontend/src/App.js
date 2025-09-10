import React from 'react';
import './App.css';
import { QAProvider } from './context/QAContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import QuestionInput from './components/QuestionInput';
import AnswerDisplay from './components/AnswerDisplay';
import Notification from './components/Notification';
import Feedback from './components/Feedback';

/**
 * PUBLIC_INTERFACE
 * App: Root SPA for Product Support Q&A assistant.
 * Layout: header, main content with question input and answer display, side panel with history and feedback.
 * Uses QAProvider for shared state and API interactions.
 */
function App() {
  return (
    <QAProvider>
      <div className="app-shell">
        <Header />
        <div className="content">
          <aside className="sidebar">
            <Sidebar />
          </aside>
          <main className="main">
            <Notification />
            <QuestionInput />
            <AnswerDisplay />
            <Feedback />
          </main>
        </div>
      </div>
    </QAProvider>
  );
}

export default App;
