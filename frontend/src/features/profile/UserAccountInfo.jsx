import { 
  Container, 
  Title, 
  Caption, 
  PrimaryButton 
} from "@/components/ui/index.js";
import { useUserProfile } from "@/hooks/useUserProfile.js";
import { useUser } from "@/contexts/UserContext.jsx";
import { useNotification } from "@/contexts/NotificationContext.jsx";
import { userService } from "@/services/user.service.js";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";

export const UserAccountInfo = () => {
  const { user } = useUser();
  const { showToastNotification } = useNotification();
  const {
    userAccountInfo,
    loading,
    error,
    updateUserProfile
  } = useUserProfile();

  const [editingField, setEditingField] = useState(null);
  const [editValues, setEditValues] = useState({});

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

  const handleEdit = (field, currentValue) => {
    setEditingField(field);
    setEditValues({ [field]: currentValue || '' });
  };

  const handleSave = async (field) => {
    try {
      const updateData = {};
      
      if (field === 'fullName' || field === 'phoneNumber' || field === 'profileImageUrl') {
        updateData.profile = {
          [field]: editValues[field]
        };
      } else if (field === 'email') {
        updateData.email = editValues[field];
      } else if (field === 'address') {
        updateData.address = {
          streetAddress: editValues.streetAddress,
          city: editValues.city,
          state: editValues.state,
          postalCode: editValues.postalCode,
          country: editValues.country,
          addressType: editValues.addressType || 'HOME'
        };
      } else if (['streetAddress', 'city', 'state', 'postalCode', 'country', 'addressType'].includes(field)) {
        updateData.address = {
          ...address,
          [field]: editValues[field]
        };
      }

      await updateUserProfile(user.id, updateData);
      setEditingField(null);
      setEditValues({});
    } catch (err) {
      console.error('Failed to save:', err);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValues({});
  };

  const handleVerify = async (field) => {
    try {
      if (field === 'email') {
        await userService.verifyEmail(user.id);
        showToastNotification('Verification email sent!', 'success');
      }
    } catch (err) {
      showToastNotification(err.message || `Failed to verify ${field}`, 'error');
    }
  };

  const InfoRow = ({ label, value, field, placeholder, type = "text", showVerify = false }) => (
    <div className="group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Caption className="text-gray-600 mb-2 font-medium">{label}</Caption>
          {editingField === field ? (
            <div className="flex items-center gap-3">
              <input
                type={type}
                value={editValues[field] || ''}
                onChange={(e) => setEditValues({ ...editValues, [field]: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green focus:border-green transition-colors"
                placeholder={placeholder}
                autoFocus
              />
              <button
                onClick={() => handleSave(field)}
                className="px-4 py-2 bg-green text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg group-hover:bg-gray-100 transition-colors">
              <span className="text-gray-900 font-medium">{value || <span className="text-gray-500">Not provided</span>}</span>
              <div className="flex items-center gap-2">
                {showVerify && (
                  <button
                    onClick={() => handleVerify(field)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    Verify
                  </button>
                )}
                <button
                  onClick={() => handleEdit(field, value)}
                  className="text-gray-600 hover:text-green text-sm font-medium flex items-center gap-1 px-3 py-1 rounded-md hover:bg-green-50 transition-colors"
                >
                  <FaEdit size={12} />
                  Edit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Container>
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="space-y-6">
          
          {/* Personal Information & Profile Avatar Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Personal Information Card - Takes 2/3 of the width */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <Title level={4} className="text-gray-800 font-semibold mb-6">Personal Information</Title>
              
              <div className="space-y-4">
                {/* Full Name */}
                <InfoRow
                  label="Full Name"
                  value={profile.fullName || user?.fullName}
                  field="fullName"
                  placeholder="Enter full name"
                />
                
                {/* Account Role */}
                <div className="group">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Caption className="text-gray-600 mb-2 font-medium">Account Role</Caption>
                      <div className="bg-gray-50 p-3 rounded-lg group-hover:bg-gray-100 transition-colors">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          userAccountInfo?.role === 'SELLER' ? 'bg-blue-100 text-blue-700' :
                          userAccountInfo?.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                          userAccountInfo?.role === 'BIDDER' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {userAccountInfo?.role || 'BIDDER'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Avatar Card - Takes 1/3 of the width, square shape */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-6 border border-gray-100 h-fit">
              <Title level={4} className="text-gray-800 font-semibold mb-6">Profile Avatar</Title>
              
              <div className="flex flex-col items-center gap-4">
                {/* Avatar Display - Square with Hover Overlay */}
                <div className="relative group cursor-pointer">
                  <div className="w-32 h-32 rounded-lg overflow-hidden border-4 border-gray-200 bg-gray-100 flex items-center justify-center">
                    {profile.profileImageUrl ? (
                      <img 
                        src={profile.profileImageUrl} 
                        alt="Profile Avatar" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center text-3xl font-bold text-gray-500 ${profile.profileImageUrl ? 'hidden' : 'flex'}`}>
                      {(profile.fullName || user?.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div 
                    className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    onClick={() => {
                      // TODO: Implement upload avatar logic
                      alert('Upload avatar feature will be implemented soon');
                    }}
                  >
                    <div className="text-white text-center">
                      <FaEdit size={20} className="mx-auto mb-2" />
                      <span className="text-sm font-medium">Update Avatar</span>
                    </div>
                  </div>
                </div>
                
                {/* Avatar Info */}
                <div className="text-center w-full">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {profile.fullName || user?.email || 'User'}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {profile.profileImageUrl ? 'Custom avatar' : 'Default avatar'}
                  </p>
                  
                  {profile.profileImageUrl && (
                    <button 
                      className="mt-3 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
                      onClick={() => {
                        // TODO: Implement remove avatar logic
                        alert('Remove avatar feature will be implemented soon');
                      }}
                    >
                      Remove Avatar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <Title level={4} className="text-gray-800 font-semibold mb-6">Contact Information</Title>
            
            <div className="space-y-4">
              {/* Email */}
              <InfoRow
                label="Email Address"
                value={userAccountInfo?.email || user?.email}
                field="email"
                type="email"
                placeholder="Enter email address"
                showVerify={!userAccountInfo?.isVerified}
              />

              {/* Phone */}
              <InfoRow
                label="Phone Number"
                value={profile.phoneNumber}
                field="phoneNumber"
                type="tel"
                placeholder="Enter phone number"
                showVerify={false}
              />
            </div>
          </div>

          {/* Address Information Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <Title level={4} className="text-gray-800 font-semibold mb-6">Address Information</Title>
              
            {/* Combined Address Information */}
            <div className="group">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Caption className="text-gray-600 mb-2 font-medium">Complete Address</Caption>
                  {editingField === 'address' ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editValues.streetAddress || ''}
                        onChange={(e) => setEditValues({ ...editValues, streetAddress: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green focus:border-green transition-colors"
                        placeholder="Street address"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={editValues.city || ''}
                          onChange={(e) => setEditValues({ ...editValues, city: e.target.value })}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green focus:border-green transition-colors"
                          placeholder="City"
                        />
                        <input
                          type="text"
                          value={editValues.state || ''}
                          onChange={(e) => setEditValues({ ...editValues, state: e.target.value })}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green focus:border-green transition-colors"
                          placeholder="State"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={editValues.postalCode || ''}
                          onChange={(e) => setEditValues({ ...editValues, postalCode: e.target.value })}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green focus:border-green transition-colors"
                          placeholder="Postal code"
                        />
                        <input
                          type="text"
                          value={editValues.country || ''}
                          onChange={(e) => setEditValues({ ...editValues, country: e.target.value })}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green focus:border-green transition-colors"
                          placeholder="Country"
                        />
                      </div>
                      <div>
                        <select
                          value={editValues.addressType || 'HOME'}
                          onChange={(e) => setEditValues({ ...editValues, addressType: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green focus:border-green transition-colors"
                        >
                          <option value="HOME">Home</option>
                          <option value="WORK">Work</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleSave('address')}
                          className="px-4 py-2 bg-green text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-3 rounded-lg group-hover:bg-gray-100 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="text-gray-900 flex-1">
                          {address.streetAddress && (
                            <div className="mb-1 font-medium">{address.streetAddress}</div>
                          )}
                          {(address.city || address.state || address.postalCode) && (
                            <div className="mb-1">
                              {[address.city, address.state, address.postalCode].filter(Boolean).join(', ')}
                            </div>
                          )}
                          {address.country && (
                            <div className="mb-1">{address.country}</div>
                          )}
                          {address.addressType && (
                            <div className="text-sm text-gray-500 mt-2">
                              Type: {address.addressType}
                            </div>
                          )}
                          {!address.streetAddress && !address.city && !address.state && !address.postalCode && !address.country && (
                            <span className="text-gray-500">Not provided</span>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setEditingField('address');
                            setEditValues({
                              streetAddress: address.streetAddress || '',
                              city: address.city || '',
                              state: address.state || '',
                              postalCode: address.postalCode || '',
                              country: address.country || '',
                              addressType: address.addressType || 'HOME'
                            });
                          }}
                          className="text-gray-600 hover:text-green text-sm font-medium flex items-center gap-1 px-3 py-1 rounded-md hover:bg-green-50 transition-colors ml-4"
                        >
                          <FaEdit size={12} />
                          Edit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
