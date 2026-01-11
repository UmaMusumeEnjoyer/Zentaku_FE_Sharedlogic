import { useState, useCallback, useEffect } from 'react';

export const useRequestModal = (isOpen: boolean, isLoading: boolean) => {
  const [message, setMessage] = useState('');

  // Reset message khi modal đóng
  useEffect(() => {
    if (!isOpen) {
      setMessage('');
    }
  }, [isOpen]);

  // Handler: Change message
  const handleMessageChange = useCallback((value: string) => {
    setMessage(value);
  }, []);

  // Handler: Submit
  const handleSubmit = useCallback((onSubmit: (message: string) => void) => {
    onSubmit(message);
    setMessage('');
  }, [message]);

  return {
    // State
    message,
    
    // Methods
    handleMessageChange,
    handleSubmit,
  };
};