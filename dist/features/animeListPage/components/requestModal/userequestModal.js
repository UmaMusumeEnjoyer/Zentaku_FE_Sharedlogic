import { useState, useCallback, useEffect } from 'react';
export const useRequestModal = (isOpen, isLoading) => {
    const [message, setMessage] = useState('');
    // Reset message khi modal đóng
    useEffect(() => {
        if (!isOpen) {
            setMessage('');
        }
    }, [isOpen]);
    // Handler: Change message
    const handleMessageChange = useCallback((value) => {
        setMessage(value);
    }, []);
    // Handler: Submit
    const handleSubmit = useCallback((onSubmit) => {
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
//# sourceMappingURL=userequestModal.js.map