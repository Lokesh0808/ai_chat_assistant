import React from 'react';
import { ChatInterface } from './components/ChatInterface';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <ChatInterface />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(31, 41, 55, 0.9)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      />
    </>
  );
}

export default App;
