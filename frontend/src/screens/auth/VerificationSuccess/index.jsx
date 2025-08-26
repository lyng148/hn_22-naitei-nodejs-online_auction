import { useLocation } from 'react-router-dom';
import {
    Container,
    Title,
    Caption,
    CustomNavLink
} from '@/components/ui/index.js';
import { IoMailOpenOutline } from 'react-icons/io5';

const VerificationSuccessPage = () => {
    const location = useLocation();
    const { message, email } = location.state || {};

    return (
        <section className="verification-success pt-16 relative">
            <div className="bg-green w-96 h-96 rounded-full opacity-20 blur-3xl absolute top-2/3"></div>

            <div className="bg-[#241C37] pt-8 h-[40vh] relative content">
                <Container>
                    <div>
                        <Title level={3} className="text-white">
                            Registration Successful
                        </Title>
                        <div className="flex items-center gap-3">
                            <Title level={5} className="text-green font-normal text-xl">Home</Title>
                            <Title level={5} className="text-white font-normal text-xl">/</Title>
                            <Title level={5} className="text-white font-normal text-xl">Registration Success</Title>
                        </div>
                    </div>
                </Container>
            </div>

            <div className="transition-all duration-500 ease-in-out transform translate-x-0">
                <div className="bg-white shadow-s3 w-1/2 m-auto my-16 p-8 rounded-xl">
                    <div className="text-center">
                        <div className="text-green text-6xl mb-6 justify-center flex"><IoMailOpenOutline /></div>
                        <Title level={4} className="text-green-600 mb-4">
                            Check Your Email!
                        </Title>

                        <div className="space-y-4 text-gray-700">
                            <Caption className="text-lg">
                                We've sent a verification email to:
                            </Caption>

                            {email && (
                                <div className="bg-gray-50 p-3 rounded-md">
                                    <Caption className="font-semibold text-green-600">
                                        {email}
                                    </Caption>
                                </div>
                            )}

                            <Caption className="text-base">
                                Please click the verification link in your email to complete your registration.
                            </Caption>

                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mt-6">
                                <Caption className="text-blue-800 text-sm">
                                    <strong>Important:</strong> The verification link will expire in 24 hours.
                                    If you don't see the email, please check your spam folder.
                                </Caption>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            <Caption className="text-gray-600">
                                Didn't receive the email?
                            </Caption>

                            <div className="space-y-3">
                                <CustomNavLink
                                    href="/auth/resend-verification"
                                    className="inline-block bg-green text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors"
                                >
                                    Resend Verification Email
                                </CustomNavLink>

                                <br />

                                <CustomNavLink
                                    href="/auth/login"
                                    className="inline-block text-gray-600 hover:text-green hover:underline"
                                >
                                    Back to Login
                                </CustomNavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VerificationSuccessPage;
