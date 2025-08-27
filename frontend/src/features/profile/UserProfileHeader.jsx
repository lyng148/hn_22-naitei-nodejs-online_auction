import { Container, Title } from "@/components/ui/index.js";
import { useUserProfile } from "@/hooks/useUserProfile.js";

export const UserProfileHeader = () => {
  const { userAccountInfo } = useUserProfile();

  return (
    <div className="bg-[#1a7d5a] pt-8 h-[40vh] relative content">
      <Container>
        <div className="flex items-center justify-between">
          <div>
            <Title level={3} className="text-white mb-2">
              {userAccountInfo?.profile?.[0]?.fullName || 'User Profile'}
            </Title>
            <div className="flex items-center gap-3">
              <Title level={5} className="text-green-200 font-normal text-xl">Home</Title>
              <Title level={5} className="text-white font-normal text-xl">/</Title>
              <Title level={5} className="text-green-200 font-normal text-xl">Dashboard</Title>
              <Title level={5} className="text-white font-normal text-xl">/</Title>
              <Title level={5} className="text-white font-normal text-xl">Profile</Title>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Navigation tabs similar to the image */}
            <div className="flex bg-white bg-opacity-10 rounded-lg p-1">
              <button className="px-4 py-2 text-white bg-green rounded-md font-medium">
                Account
              </button>
              <button className="px-4 py-2 text-white hover:bg-white hover:bg-opacity-10 rounded-md">
                Order
              </button>
              <button className="px-4 py-2 text-white hover:bg-white hover:bg-opacity-10 rounded-md">
                Shipping
              </button>
            </div>
            <div className="text-white">
              {userAccountInfo?.profile?.[0]?.fullName || 'User'} (0)
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
