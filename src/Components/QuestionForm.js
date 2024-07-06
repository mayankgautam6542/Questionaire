import React, { useState } from 'react';
import './QuestionForm.css';

const QuestionForm = () => {
  const [questions, setQuestions] = useState([]);

  const addQuestion = (parentIndex = null) => {
    const newQuestion = {
      id: Date.now(),
      text: '',
      type: 'Short Answer',
      parentIndex: parentIndex,
      children: []
    };

    if (parentIndex === null) {
      setQuestions([...questions, newQuestion]);
    } else {
      const updatedQuestions = [...questions];
      const parentQuestion = findQuestion(updatedQuestions, parentIndex);
      parentQuestion.children.push(newQuestion);
      setQuestions(updatedQuestions);
    }
  };

  const deleteQuestion = (id, parentIndex = null) => {
    if (parentIndex === null) {
      setQuestions(questions.filter(q => q.id !== id));
    } else {
      const updatedQuestions = [...questions];
      const parentQuestion = findQuestion(updatedQuestions, parentIndex);
      parentQuestion.children = parentQuestion.children.filter(q => q.id !== id);
      setQuestions(updatedQuestions);
    }
  };

  const findQuestion = (questions, id) => {
    for (let question of questions) {
      if (question.id === id) return question;
      const foundInChild = findQuestion(question.children, id);
      if (foundInChild) return foundInChild;
    }
    return null;
  };

  const handleChange = (id, field, value) => {
    const updatedQuestions = [...questions];
    const question = findQuestion(updatedQuestions, id);
    question[field] = value;
    setQuestions(updatedQuestions);
  };

  const renderQuestions = (questions, parentIndex = null) => {
    return questions.map((q) => (
      <div key={q.id} className="question" style={{ marginLeft: parentIndex !== null ? 20 : 0 }}>
        <input
          type="text"
          placeholder="Question Text"
          value={q.text}
          onChange={(e) => handleChange(q.id, 'text', e.target.value)}
        />
        <select
          value={q.type}
          onChange={(e) => handleChange(q.id, 'type', e.target.value)}
        >
          <option value="Short Answer">Short Answer</option>
          <option value="True/False">True/False</option>
        </select>
        <button onClick={() => deleteQuestion(q.id, parentIndex)}>Delete</button>
        {q.type === 'True/False' && (
          <button onClick={() => addQuestion(q.id)}>Add Child Question</button>
        )}
        {q.children.length > 0 && renderQuestions(q.children, q.id)}
      </div>
    ));
  };

  return (
    <div>
      <button onClick={() => addQuestion()}>Add New Question</button>
      {renderQuestions(questions)}
    </div>
  );
};

export default QuestionForm;
