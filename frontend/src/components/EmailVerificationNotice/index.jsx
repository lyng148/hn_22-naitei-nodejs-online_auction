import { useState } from 'react';
import { 
  Caption,
  CustomNavLink,
  PrimaryButton 
} from '@/components/ui/index.js';
import { useEmailVerification } from '@/hooks/useEmailVerification.js';

const EmailVerificationNotice = ({ email, onClose }) => {
  const [showNotice, setShowNotice] = useState(true);
  const { handleResendVerification, loading } = useEmailVerification();

  const handleResend = async () => {
    if (email) {
      await handleResendVerification(email);
    }
  };

  const handleCloseNotice = () => {
    setShowNotice(false);
    if (onClose) onClose();
  };

  if (!showNotice) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="text-yellow-400 text-xl">⚠️</div>
        </div>
        <div className="ml-3 flex-1">
          <Caption className="text-yellow-800 font-medium">
            Email Verification Required
          </Caption>
          <Caption className="text-yellow-700 mt-1">
            Please verify your email address to access all features. Check your email for the verification link.
          </Caption>
          <div className="mt-3 flex space-x-3">
            <PrimaryButton
              onClick={handleResend}
              disabled={loading}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 text-sm"
            >
              {loading ? 'Sending...' : 'Resend Email'}
            </PrimaryButton>
            <CustomNavLink 
              href="/auth/resend-verification"
              className="text-yellow-800 hover:text-yellow-900 text-sm font-medium"
            >
              Go to Resend Page
            </CustomNavLink>
          </div>
        </div>
        <div className="ml-3 flex-shrink-0">
          <button
            type="button"
            onClick={handleCloseNotice}
            className="text-yellow-400 hover:text-yellow-600"
          >
            <span className="sr-only">Close</span>
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationNotice;
