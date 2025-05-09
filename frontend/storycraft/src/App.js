import React, { useEffect, useState } from 'react';
import { getMessage } from './services/api';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMessage = async () => {
      const data = await getMessage();
      if (data) setMessage(data);
    };

    fetchMessage();
  }, []);

  return (
    <div className="App">
      <h1>{message ? message : 'Loading...'}</h1>
    </div>
  );
}

export default App;
