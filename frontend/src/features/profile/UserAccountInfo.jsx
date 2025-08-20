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
import { UserWarningModal } from "@/features/profile/UserWarningModal";
import { useUserWarnings } from "@/hooks/useUserWarnings.js";
import { useState, useRef } from "react";
import { FaEdit, FaExclamationTriangle } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";

export const UserAccountInfo = () => {
  const { user, avatarUrl, setAvatarUrl } = useUser();
  const { showToastNotification } = useNotification();
  const { warnings, warningStatus } = useUserWarnings();
  const {
    userAccountInfo,
    loading,
    error,
    updateUserProfile
  } = useUserProfile();

  const [editingField, setEditingField] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const fileInputRef = useRef(null);

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

  const handleRemoveAvatar = async () => {
    try {
      const updateData = {
        profile: {
          profileImageUrl: ""
        }
      };
      await updateUserProfile(user.id, updateData);
      setAvatarUrl(null); // Reset to default avatar in header
      showToastNotification('Avatar removed successfully!', 'success');
    } catch (err) {
      console.error('Failed to remove avatar:', err);
      showToastNotification('Failed to remove avatar', 'error');
    }
  };

  const handleAvatarUpload = async (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      showToastNotification('Only image files (JPEG, PNG, WebP, GIF) are allowed', 'error');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showToastNotification('File size must be less than 5MB', 'error');
      return;
    }

    setAvatarUploading(true);

    try {
      const response = await userService.uploadAvatar(user.id, file);
      const imageUrl = response.imageUrl;
      
      // Update the profile with the new avatar URL
      const updateData = {
        profile: {
          profileImageUrl: imageUrl
        }
      };
      await updateUserProfile(user.id, updateData);
      setAvatarUrl(imageUrl); // Update avatar in header
      showToastNotification('Avatar uploaded successfully!', 'success');
    } catch (err) {
      console.error('Avatar upload error:', err);
      showToastNotification(err.message || 'Avatar upload failed', 'error');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleAvatarUpload(file);
    }
    // Reset input
    e.target.value = '';
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
    <div className="p-6"> 
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="space-y-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
            <p className="text-gray-600">Manage your personal information and account settings</p>
          </div>
          
          {/* Personal Information & Profile Avatar Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Personal Information Card*/}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <Title level={4} className="text-gray-800 font-semibold">Personal Information</Title>
                
                {/* Warning Status*/}
                {warningStatus && (
                  <div 
                    className="cursor-pointer group flex items-center"
                    onClick={() => setShowWarningModal(true)}
                    title="Click to view account status"
                  >
                    {(warningStatus.warningCount > 0 || warningStatus.isBanned) ? (
                      // Warning/Banned Status
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 group-hover:shadow-md ${
                        warningStatus.isBanned 
                          ? 'bg-red-100 text-red-700 border border-red-200' 
                          : warningStatus.warningCount >= 2
                          ? 'bg-orange-100 text-orange-700 border border-orange-200'
                          : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      }`}>
                        <FaExclamationTriangle size={14} />
                        <span>
                          {warningStatus.isBanned 
                            ? 'Banned'
                            : `${warningStatus.warningCount} Warning${warningStatus.warningCount > 1 ? 's' : ''}`
                          }
                        </span>
                      </div>
                    ) : (
                      // Good Standing Status (Optional - subtle)
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200 opacity-70 group-hover:opacity-100 transition-all duration-200">
                        <span className="text-xs font-bold">✓</span>
                        <span>Good Standing</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                {/* Full Name */}
                <InfoRow
                  label="Full Name"
                  value={profile.fullName}
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
                          userAccountInfo?.role === 'BIDDER' ? 'bg-green text-white' :
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
                {/* Avatar Display - Square with Hover Overlay and Remove Icon */}
                <div className="relative group cursor-pointer">
                  <div className="w-32 h-32 rounded-lg overflow-hidden border-4 border-gray-200 bg-gray-100 flex items-center justify-center">
                    {(profile.profileImageUrl || avatarUrl) ? (
                      <img 
                        src={profile.profileImageUrl || avatarUrl} 
                        alt="Profile Avatar" 
                        className={`w-full h-full object-cover ${avatarUploading ? 'opacity-50' : ''}`}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center text-3xl font-bold text-gray-500 ${(profile.profileImageUrl || avatarUrl) ? 'hidden' : 'flex'} ${avatarUploading ? 'opacity-50' : ''}`}>
                      {(profile.fullName || user?.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    
                    {/* Loading overlay */}
                    {avatarUploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                          <span className="text-sm font-medium">Uploading...</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Remove Avatar X Icon - Top Right Corner */}
                  {(profile.profileImageUrl || avatarUrl) && !avatarUploading && (
                    <button
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveAvatar();
                      }}
                      title="Remove Avatar"
                    >
                      <IoCloseOutline size={16} />
                    </button>
                  )}
                  
                  {/* Hover Overlay for Upload */}
                  {!avatarUploading && (
                    <div 
                      className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={handleAvatarClick}
                    >
                      <div className="text-white text-center">
                        <FaEdit size={20} className="mx-auto mb-2" />
                        <span className="text-sm font-medium">Update Avatar</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {/* Avatar Info */}
                <div className="text-center w-full">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {profile.fullName || user?.email || 'User'}
                  </h3>
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
            <Title level={4} className="text-gray-800 font-semibold mb-2">Address Information</Title>
              
            {/* Combined Address Information */}
            <div className="group">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {/* <Caption className="text-gray-600 mb-2 font-medium">Complete Address</Caption> */}
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

      {/* Warning Details Modal */}
      <UserWarningModal 
        isOpen={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        warnings={warnings}
        warningStatus={warningStatus}
      />
    </div>
  );
};
