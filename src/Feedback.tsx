// Feedback.tsx
import React from 'react';

interface FeedbackProps {
  message: string;
  isError: boolean;
}

const Feedback: React.FC<FeedbackProps> = ({ message, isError }) => {
  return (
    <div style={{ color: isError ? 'red' : 'green' }}>
      {message}
    </div>
  );
};

export default Feedback;
export {};
