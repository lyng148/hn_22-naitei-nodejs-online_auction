import { useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import {
    Container,
    Title,
    PrimaryButton,
    Caption,
    CustomNavLink
} from '@/components/ui/index.js';
import { useEmailVerification } from '@/hooks/useEmailVerification.js';

const VerifyEmailPage = () => {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const token = searchParams.get('token');
    const { message, email } = location.state || {};
    const {
        loading,
        error,
        success,
        handleVerifyEmail,
    } = useEmailVerification();

    useEffect(() => {
        if (token) {
            handleVerifyEmail(token);
        }
    }, [token]);

    return (
        <section className="verify-email pt-16 relative">
            <div className="bg-green w-96 h-96 rounded-full opacity-20 blur-3xl absolute top-2/3"></div>

            <div className="bg-[#241C37] pt-8 h-[40vh] relative content">
                <Container>
                    <div>
                        <Title level={3} className="text-white">
                            Email Verification
                        </Title>
                        <div className="flex items-center gap-3">
                            <Title level={5} className="text-green font-normal text-xl">Home</Title>
                            <Title level={5} className="text-white font-normal text-xl">/</Title>
                            <Title level={5} className="text-white font-normal text-xl">Verify Email</Title>
                        </div>
                    </div>
                </Container>
            </div>

            <div className="transition-all duration-500 ease-in-out transform translate-x-0">
                <div className="bg-white shadow-s3 w-1/3 m-auto my-16 p-8 rounded-xl">
                    <div className="text-center">
                        <Title level={5}>Email Verification</Title>

                        {loading && (
                            <div className="mt-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green mx-auto"></div>
                                <Caption className="mt-4 text-gray-600">Verifying your email...</Caption>
                            </div>
                        )}

                        {success && (
                            <div className="mt-8">
                                <div className="text-green-500 text-6xl mb-4">✓</div>
                                <Title level={6} className="text-green-600 mb-4">
                                    Email Verified Successfully!
                                </Title>
                                <Caption className="text-gray-600 mb-6">
                                    Your email has been verified. You can now log in to your account.
                                </Caption>
                                <Caption className="text-gray-600">
                                    Redirecting to login page...
                                </Caption>
                            </div>
                        )}

                        {error && !loading && (
                            <div className="mt-8">
                                <div className="text-red-500 text-6xl mb-4">✗</div>
                                <Title level={6} className="text-red-600 mb-4">
                                    Verification Failed
                                </Title>
                                <Caption className="text-red-600 mb-6">
                                    {error}
                                </Caption>
                                <div className="space-y-4">
                                    <CustomNavLink
                                        href="/auth/resend-verification"
                                        className="inline-block text-green font-medium hover:underline"
                                    >
                                        Request New Verification Email
                                    </CustomNavLink>
                                    <br />
                                    <CustomNavLink
                                        href="/auth/login"
                                        className="inline-block text-gray-600 hover:underline"
                                    >
                                        Back to Login
                                    </CustomNavLink>
                                </div>
                            </div>
                        )}

                        {!token && !loading && (
                            <div className="mt-8">
                                <div className="text-yellow-500 text-6xl mb-4">⚠</div>
                                <Title level={6} className="text-yellow-600 mb-4">
                                    Invalid Verification Link
                                </Title>
                                <Caption className="text-gray-600 mb-6">
                                    The verification link is invalid or missing. Please check your email for the correct link.
                                </Caption>
                                <div className="space-y-4">
                                    <CustomNavLink
                                        href="/auth/resend-verification"
                                        className="inline-block text-green font-medium hover:underline"
                                    >
                                        Request New Verification Email
                                    </CustomNavLink>
                                    <br />
                                    <CustomNavLink
                                        href="/auth/register"
                                        className="inline-block text-gray-600 hover:underline"
                                    >
                                        Back to Register
                                    </CustomNavLink>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VerifyEmailPage;
