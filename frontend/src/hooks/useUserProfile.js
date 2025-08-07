import { useState, useEffect, useCallback } from "react";
import { userService } from "@/services/user.service.js";
import { useNotification } from "@/contexts/NotificationContext.jsx";
import { useUser } from "@/contexts/UserContext.jsx";

export const useUserProfile = () => {
  const [userAccountInfo, setUserAccountInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  
  const { user, setAvatarUrl } = useUser();
  const { showToastNotification } = useNotification();

  // Form states for editing
  const [formData, setFormData] = useState({
    email: "",
    profile: {
      fullName: "",
      phoneNumber: "",
      profileImageUrl: ""
    },
    address: {
      streetAddress: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      addressType: "HOME"
    }
  });

  // Fetch user account info
  const fetchUserAccountInfo = useCallback(async (userId) => {
    if (!userId) return;
    
    setLoading(true);
    setError("");
    
    try {
      const data = await userService.getUserAccountInfo(userId);
      setUserAccountInfo(data);
      
      // Sync avatar URL with UserContext
      const profileImageUrl = data.profile?.[0]?.profileImageUrl;
      if (profileImageUrl) {
        setAvatarUrl(profileImageUrl);
      }
      
      // Initialize form data with current user info
      setFormData({
        email: data.email || "",
        profile: {
          fullName: data.profile?.[0]?.fullName || "",
          phoneNumber: data.profile?.[0]?.phoneNumber || "",
          profileImageUrl: profileImageUrl || ""
        },
        address: {
          streetAddress: data.addresses?.[0]?.streetAddress || "",
          city: data.addresses?.[0]?.city || "",
          state: data.addresses?.[0]?.state || "",
          postalCode: data.addresses?.[0]?.postalCode || "",
          country: data.addresses?.[0]?.country || "",
          addressType: data.addresses?.[0]?.addressType || "HOME"
        }
      });
    } catch (err) {
      console.error('Failed to fetch user account info:', err);
      setError(err.message || 'Failed to load user information');
      showToastNotification(err.message || 'Failed to load user information', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToastNotification, setAvatarUrl]);

  // Update user profile
  const updateUserProfile = async (userId, updateData) => {
    setLoading(true);
    setError("");
    
    try {
      const data = await userService.updateProfile(userId, updateData);
      setUserAccountInfo(data);
      
      // Sync avatar URL with UserContext when profile image is updated
      const profileImageUrl = data.profile?.[0]?.profileImageUrl;
      if (profileImageUrl !== undefined) {
        // If profileImageUrl is empty/null, keep current avatar; if it has value, update it
        if (profileImageUrl) {
          setAvatarUrl(profileImageUrl);
        }
      }
      
      showToastNotification('Profile updated successfully!', 'success');
      setIsEditing(false);
      return data;
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err.message || 'Failed to update profile');
      showToastNotification(err.message || 'Failed to update profile', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    // Prepare update data (only send non-empty fields)
    const updateData = {};
    
    if (formData.email && formData.email !== userAccountInfo?.email) {
      updateData.email = formData.email;
    }
    
    // Check if profile fields have changed
    const hasProfileChanges = 
      formData.profile.fullName !== (userAccountInfo?.profile?.[0]?.fullName || "") ||
      formData.profile.phoneNumber !== (userAccountInfo?.profile?.[0]?.phoneNumber || "") ||
      formData.profile.profileImageUrl !== (userAccountInfo?.profile?.[0]?.profileImageUrl || "");
    
    if (hasProfileChanges) {
      updateData.profile = {
        fullName: formData.profile.fullName,
        phoneNumber: formData.profile.phoneNumber,
        profileImageUrl: formData.profile.profileImageUrl
      };
    }
    
    // Check if address fields have changed
    const hasAddressChanges = 
      formData.address.streetAddress !== (userAccountInfo?.addresses?.[0]?.streetAddress || "") ||
      formData.address.city !== (userAccountInfo?.addresses?.[0]?.city || "") ||
      formData.address.state !== (userAccountInfo?.addresses?.[0]?.state || "") ||
      formData.address.postalCode !== (userAccountInfo?.addresses?.[0]?.postalCode || "") ||
      formData.address.country !== (userAccountInfo?.addresses?.[0]?.country || "") ||
      formData.address.addressType !== (userAccountInfo?.addresses?.[0]?.addressType || "HOME");
    
    if (hasAddressChanges && formData.address.streetAddress && formData.address.city && formData.address.country) {
      updateData.address = {
        streetAddress: formData.address.streetAddress,
        city: formData.address.city,
        state: formData.address.state,
        postalCode: formData.address.postalCode,
        country: formData.address.country,
        addressType: formData.address.addressType
      };
    }

    if (Object.keys(updateData).length === 0) {
      showToastNotification('No changes to save', 'info');
      setIsEditing(false);
      return;
    }

    await updateUserProfile(user.id, updateData);
  };

  // Auto-fetch user data when component mounts
  useEffect(() => {
    if (user?.id) {
      fetchUserAccountInfo(user.id);
    }
  }, [user?.id, fetchUserAccountInfo]);

  return {
    userAccountInfo,
    loading,
    error,
    isEditing,
    setIsEditing,
    formData,
    setFormData,
    handleInputChange,
    handleSubmit,
    fetchUserAccountInfo,
    updateUserProfile
  };
};
