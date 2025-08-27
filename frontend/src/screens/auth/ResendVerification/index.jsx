import { useState } from 'react';
import {
    Container,
    Title,
    PrimaryButton,
    Caption,
    CustomNavLink,
    commonClassNameOfInput
} from '@/components/ui/index.js';
import { useEmailVerification } from '@/hooks/useEmailVerification.js';

const ResendVerificationPage = () => {
    const [email, setEmail] = useState('');
    const {
        loading,
        error,
        handleResendVerification,
        setError,
    } = useEmailVerification();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setError('Email is required');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        await handleResendVerification(email);
    };

    return (
        <section className="resend-verification pt-16 relative">
            <div className="bg-green w-96 h-96 rounded-full opacity-20 blur-3xl absolute top-2/3"></div>

            <div className="bg-[#241C37] pt-8 h-[40vh] relative content">
                <Container>
                    <div>
                        <Title level={3} className="text-white">
                            Resend Verification Email
                        </Title>
                        <div className="flex items-center gap-3">
                            <Title level={5} className="text-green font-normal text-xl">Home</Title>
                            <Title level={5} className="text-white font-normal text-xl">/</Title>
                            <Title level={5} className="text-white font-normal text-xl">Resend Verification</Title>
                        </div>
                    </div>
                </Container>
            </div>

            <div className="transition-all duration-500 ease-in-out transform translate-x-0">
                <div className="bg-white shadow-s3 w-1/3 m-auto my-16 p-8 rounded-xl">
                    <form onSubmit={handleSubmit}>
                        <div className="text-center">
                            <Title level={5}>Resend Verification Email</Title>
                            <Caption className="mt-2 text-gray-600">
                                Enter your email address to receive a new verification link
                            </Caption>
                        </div>

                        {error && (
                            <div className="text-center">
                                <div className="text-red-500 mt-4 p-3 bg-red-50 rounded-md">{error}</div>
                            </div>
                        )}

                        <div className="py-5 mt-8">
                            <Caption className="mb-2">Email Address *</Caption>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (error) setError('');
                                }}
                                className={commonClassNameOfInput}
                                placeholder="Enter your email address"
                                required
                            />
                        </div>

                        <PrimaryButton
                            className="w-full rounded-none my-5"
                            disabled={loading}
                            type="submit"
                        >
                            {loading ? "SENDING..." : "SEND VERIFICATION EMAIL"}
                        </PrimaryButton>

                        <div className="text-center mt-6 space-y-3">
                            <p className="text-gray-600">
                                Remember your login details?{" "}
                                <CustomNavLink href="/auth/login" className="text-green font-medium">
                                    Log In Here
                                </CustomNavLink>
                            </p>
                            <p className="text-gray-600">
                                Don't have an account?{" "}
                                <CustomNavLink href="/auth/register" className="text-green font-medium">
                                    Sign Up Here
                                </CustomNavLink>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ResendVerificationPage;
