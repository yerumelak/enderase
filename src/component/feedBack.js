import React, { useState } from 'react';
import '../Styles/Feedback.css'

const Feedback = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (!name || !email || !message) {
      setFeedbackMessage('Please fill out all fields.');
      return;
    }

    // Here you would handle the submission logic
    // For example, send data to the server (mocked for now)
    setTimeout(() => {
      setFeedbackMessage('Thank you for your feedback!');
      setName('');
      setEmail('');
      setMessage('');
    }, 1000);
  };

  return (
    <section className="feedback">
      <h2>Feedback</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="feedback-name">Name:</label>
          <input
            type="text"
            id="feedback-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
        </div>
        <div>
          <label htmlFor="feedback-email">Email:</label>
          <input
            type="email"
            id="feedback-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
          />
        </div>
        <div>
          <label htmlFor="feedback-message">Message:</label>
          <textarea
            id="feedback-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your feedback"
            required
          />
        </div>
        <button type="submit">Submit Feedback</button>
      </form>

      {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}
    </section>
  );
};

export default Feedback;
