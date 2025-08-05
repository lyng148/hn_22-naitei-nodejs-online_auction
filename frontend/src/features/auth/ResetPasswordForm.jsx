import {
  Caption,
  Container,
  CustomNavLink,
  PrimaryButton,
  Title,
  commonClassNameOfInput,
} from "@/components/ui/index.js";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "@/contexts/NotificationContext.jsx";
import { useUser } from "@/contexts/UserContext.jsx";
import { useResetPassword } from "@/hooks/useResetPassword.js";

export const ResetPasswordForm = () => {
  const { user, loading: userLoading } = useUser();
  const { showToastNotification } = useNotification();
  const navigate = useNavigate();
  const {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    success,
    error,
    token,
    handleSubmit,
  } = useResetPassword();

  useEffect(() => {
    if (!userLoading && user.id && user.email && user.role) {
      showToastNotification(`You are already logged in as ${user.email}`, "info");
      navigate("/dashboard");
    }
  }, [userLoading, navigate, showToastNotification, user]);

  if (!token && !error) {
    return (
      <section className="register pt-16 relative">
        <div className="bg-[#241C37] pt-8 h-[40vh] relative content">
          <Container>
            <div>
              <Title level={3} className="text-white">
                Reset Password
              </Title>
            </div>
          </Container>
        </div>
        <div className="bg-white shadow-s3 w-1/3 m-auto my-16 p-8 rounded-xl">
          <div className="text-center">
            <Title level={5}>Loading...</Title>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="register pt-16 relative">
      <div className="bg-green w-96 h-96 rounded-full opacity-20 blur-3xl absolute top-2/3"></div>

      <div className="bg-[#241C37] pt-8 h-[40vh] relative content">
        <Container>
          <div>
            <Title level={3} className="text-white">
              Reset Password
            </Title>
            <div className="flex items-center gap-3">
              <Title level={5} className="text-green font-normal text-xl">Home</Title>
              <Title level={5} className="text-white font-normal text-xl">/</Title>
              <Title level={5} className="text-white font-normal text-xl">Reset Password</Title>
            </div>
          </div>
        </Container>
      </div>

      <div className="transition-all duration-500 ease-in-out transform translate-x-0">
        <div className="bg-white shadow-s3 w-1/3 m-auto my-16 p-8 rounded-xl">
          {!success ? (
            <form onSubmit={handleSubmit}>
              <div className="text-center">
                <Title level={5}>Create New Password</Title>
                <p className="mt-2 text-lg text-gray-600">
                  Enter your new password below
                </p>
              </div>

              {error && (
                <div className="text-center">
                  <div className="text-red-500 mt-4">{error}</div>
                </div>
              )}

              <div className="py-5 mt-8">
                <Caption className="mb-2">New Password *</Caption>
                <input
                  type="password"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={commonClassNameOfInput}
                  placeholder="Enter New Password"
                  required
                  disabled={loading}
                />
              </div>

              <div className="pb-5">
                <Caption className="mb-2">Confirm New Password *</Caption>
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={commonClassNameOfInput}
                  placeholder="Confirm New Password"
                  required
                  disabled={loading}
                />
              </div>

              <PrimaryButton 
                className="w-full rounded-none my-5" 
                disabled={loading}
              >
                {loading ? "RESETTING..." : "RESET PASSWORD"}
              </PrimaryButton>

              <div className="text-center mt-4">
                <p className="text-gray-600">
                  Remember your password?{" "}
                  <CustomNavLink href="/auth/login">Back to Login</CustomNavLink>
                </p>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <Title level={5} className="text-green">Password Reset Successfully!</Title>
                <p className="mt-2 text-lg text-gray-600">
                  Your password has been reset successfully.
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  You will be redirected to the login page shortly.
                </p>
              </div>

              <div className="text-center">
                <CustomNavLink href="/auth/login" className="text-green font-medium">
                  Go to Login
                </CustomNavLink>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
