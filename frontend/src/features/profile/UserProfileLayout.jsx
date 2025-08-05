import { useState } from "react";
import { UserAccountInfo } from "@/features/profile/UserAccountInfo";
import { Container, Title } from "@/components/ui/index.js";
import { useUser } from "@/contexts/UserContext.jsx";
import { useUserProfile } from "@/hooks/useUserProfile.js";

const ProfileTabs = {
  ACCOUNT: 'Account',
  WATCHLIST: 'Watchlist', 
  ORDER: 'Order',
  PAYMENT_HISTORY: 'Payment history',
  SHIPPING: 'Shipping'
};

export const UserProfileLayout = () => {
  const [activeTab, setActiveTab] = useState(ProfileTabs.ACCOUNT);
  const { user } = useUser();
  const { userAccountInfo } = useUserProfile();

  const tabComponents = {
    [ProfileTabs.ACCOUNT]: <UserAccountInfo />,
    [ProfileTabs.WATCHLIST]: <div className="text-center py-8">Watchlist - Coming Soon</div>,
    [ProfileTabs.ORDER]: <div className="text-center py-8">Orders - Coming Soon</div>,
    [ProfileTabs.PAYMENT_HISTORY]: <div className="text-center py-8">Payment History - Coming Soon</div>,
    [ProfileTabs.SHIPPING]: <div className="text-center py-8">Shipping - Coming Soon</div>,
  };

  return (
    <section className="profile pt-8 relative">
      {/* Background decoration */}
      <div className="bg-green w-96 h-96 rounded-full opacity-20 blur-3xl absolute top-2/3"></div>
      
      {/* Profile Header Section */}
      <div className="bg-[#1a7d5a] pt-8 pb-16 relative">
        <Container>
          <div className="flex items-center justify-center">
            {/* <div>
              <Title level={3} className="text-white mb-2">
                {userAccountInfo?.profile?.[0]?.fullName || user?.email || 'User Profile'}
              </Title>
            </div> */}
          </div>
        </Container>
      </div>

      {/* Tab Navigation */}
      <div className="relative -mt-16 z-20">
        <Container>
          <div className="bg-white rounded-lg shadow-lg p-2 inline-flex mb-4">
            {Object.values(ProfileTabs).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-md font-medium transition-colors relative ${
                  activeTab === tab
                    ? 'bg-green text-white shadow-lg'
                    : 'text-gray-600 hover:text-green hover:bg-green-50'
                }`}
                style={activeTab === tab ? { zIndex: 25 } : {}}
              >
                {tab}
              </button>
            ))}
          </div>
        </Container>
      </div>

      {/* Tab Content */}
      <div className="relative z-10">
        {tabComponents[activeTab]}
      </div>
    </section>
  );
};
