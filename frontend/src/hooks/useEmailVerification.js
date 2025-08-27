import { useState } from 'react';
import { verifyEmail, resendVerification } from '@/services/authService.js';
import { useNotification } from '@/contexts/NotificationContext.jsx';
import { useNavigate } from 'react-router-dom';

export const useEmailVerification = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { showToastNotification } = useNotification();
    const navigate = useNavigate();

    const handleVerifyEmail = async (token) => {
        if (!token) {
            setError('Verification token is required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await verifyEmail(token);
            setSuccess(true);
            showToastNotification(response.message || 'Email verified successfully!', 'success');

            // Redirect to login page after successful verification
            setTimeout(() => {
                navigate('/auth/login');
            }, 2000);
        } catch (err) {
            setError(err.message);
            showToastNotification(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleResendVerification = async (email) => {
        if (!email) {
            setError('Email is required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await resendVerification(email);
            showToastNotification(response.message || 'Verification email sent!', 'success');
        } catch (err) {
            setError(err.message);
            showToastNotification(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        success,
        handleVerifyEmail,
        handleResendVerification,
        setError,
    };
};
