import { 
  Container, 
  Title, 
  Caption, 
  PrimaryButton,
  commonClassNameOfInput 
} from "@/components/ui/index.js";
import { useUserProfile } from "@/hooks/useUserProfile.js";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes } from "react-icons/fa";

export const UserProfileForm = () => {
  const {
    userAccountInfo,
    loading,
    error,
    isEditing,
    setIsEditing,
    formData,
    handleInputChange,
    handleSubmit
  } = useUserProfile();

  if (loading && !userAccountInfo) {
    return (
      <Container>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading profile...</div>
        </div>
      </Container>
    );
  }

  if (error && !userAccountInfo) {
    return (
      <Container>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">{error}</div>
        </div>
      </Container>
    );
  }

  const profile = userAccountInfo?.profile?.[0] || {};
  const address = userAccountInfo?.addresses?.[0] || {};

  return (
    <Container>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-green_100 rounded-full flex items-center justify-center">
                {profile.profileImageUrl ? (
                  <img 
                    src={profile.profileImageUrl} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <FaUser className="text-3xl text-green" />
                )}
              </div>
              <div>
                <Title level={3} className="text-gray-800">
                  {profile.fullName || 'User Profile'}
                </Title>
                <p className="text-gray-600">{userAccountInfo?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    userAccountInfo?.role === 'SELLER' ? 'bg-blue-100 text-blue-800' :
                    userAccountInfo?.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {userAccountInfo?.role}
                  </span>
                </div>
              </div>
            </div>
            <div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  <FaEdit size={16} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                  >
                    <FaTimes size={16} />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <Title level={4} className="mb-4 flex items-center gap-2">
                <FaUser className="text-green" />
                Personal Information
              </Title>
              
              <div className="space-y-4">
                <div>
                  <Caption className="mb-2">Email Address</Caption>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', '', e.target.value)}
                      className={commonClassNameOfInput}
                      placeholder="Enter email address"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                      <FaEnvelope className="text-gray-500" />
                      <span>{userAccountInfo?.email || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Caption className="mb-2">Full Name</Caption>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.profile.fullName}
                      onChange={(e) => handleInputChange('profile', 'fullName', e.target.value)}
                      className={commonClassNameOfInput}
                      placeholder="Enter full name"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                      <FaUser className="text-gray-500" />
                      <span>{profile.fullName || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Caption className="mb-2">Phone Number</Caption>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.profile.phoneNumber}
                      onChange={(e) => handleInputChange('profile', 'phoneNumber', e.target.value)}
                      className={commonClassNameOfInput}
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                      <FaPhone className="text-gray-500" />
                      <span>{profile.phoneNumber || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Caption className="mb-2">Profile Image URL</Caption>
                  {isEditing ? (
                    <input
                      type="url"
                      value={formData.profile.profileImageUrl}
                      onChange={(e) => handleInputChange('profile', 'profileImageUrl', e.target.value)}
                      className={commonClassNameOfInput}
                      placeholder="Enter profile image URL"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                      <FaUser className="text-gray-500" />
                      <span>{profile.profileImageUrl || 'Not provided'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <Title level={4} className="mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-green" />
                Address Information
              </Title>
              
              <div className="space-y-4">
                <div>
                  <Caption className="mb-2">Street Address</Caption>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.address.streetAddress}
                      onChange={(e) => handleInputChange('address', 'streetAddress', e.target.value)}
                      className={commonClassNameOfInput}
                      placeholder="Enter street address"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md">
                      <span>{address.streetAddress || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Caption className="mb-2">City</Caption>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.address.city}
                        onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                        className={commonClassNameOfInput}
                        placeholder="Enter city"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md">
                        <span>{address.city || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Caption className="mb-2">State</Caption>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.address.state}
                        onChange={(e) => handleInputChange('address', 'state', e.target.value)}
                        className={commonClassNameOfInput}
                        placeholder="Enter state"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md">
                        <span>{address.state || 'Not provided'}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Caption className="mb-2">Postal Code</Caption>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.address.postalCode}
                        onChange={(e) => handleInputChange('address', 'postalCode', e.target.value)}
                        className={commonClassNameOfInput}
                        placeholder="Enter postal code"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md">
                        <span>{address.postalCode || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Caption className="mb-2">Country</Caption>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.address.country}
                        onChange={(e) => handleInputChange('address', 'country', e.target.value)}
                        className={commonClassNameOfInput}
                        placeholder="Enter country"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md">
                        <span>{address.country || 'Not provided'}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Caption className="mb-2">Address Type</Caption>
                  {isEditing ? (
                    <select
                      value={formData.address.addressType}
                      onChange={(e) => handleInputChange('address', 'addressType', e.target.value)}
                      className={commonClassNameOfInput}
                    >
                      <option value="HOME">Home</option>
                      <option value="WORK">Work</option>
                      <option value="OTHER">Other</option>
                    </select>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md">
                      <span>{address.addressType || 'Not provided'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <Title level={4} className="mb-4">Account Details</Title>
            <div className="grid grid-cols-1 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-md">
                <div className="text-sm text-gray-600">Account Role</div>
                <div className="font-semibold text-lg">{userAccountInfo?.role || 'BIDDER'}</div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="flex justify-center mt-6">
              <PrimaryButton 
                className="px-8 py-3 flex items-center gap-2"
                disabled={loading}
              >
                <FaSave size={16} />
                {loading ? 'Saving...' : 'Save Changes'}
              </PrimaryButton>
            </div>
          )}
        </form>
      </div>
    </Container>
  );
};
