// src/App.jsx
import React, { useState } from 'react';
import InputForm from './components/InputForm.jsx';
import Quiz from './components/Quiz.jsx';
import Login from './components/Login.jsx';
import { Container } from '@mui/material';

export default function App() {
  const [stage, setStage] = useState('input');
  const [questions, setQuestions] = useState([]);
  const [attempts, setAttempts] = useState(0);

  const handleGenerate = async (data) => {
    const formData = new FormData();
    if (data.youtubeLink) formData.append('youtubeLink', data.youtubeLink);
    if (data.pdfFile) formData.append('pdf', data.pdfFile);

    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Could not generate quiz. Please check your input.');
      }

      const json = await res.json();
      setQuestions(json.questions);

      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 5) {
        setStage('login');
      } else {
        setStage('quiz');
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const handleReset = () => {
    setStage('input');
    setQuestions([]);
  };

  return (
    <Container maxWidth="md" style={{ paddingTop: '2rem' }}>
      {stage === 'input' && <InputForm onSubmit={handleGenerate} />}
      {stage === 'quiz' && <Quiz questions={questions} onReset={handleReset} />}
      {stage === 'login' && <Login />}
    </Container>
  );
}

