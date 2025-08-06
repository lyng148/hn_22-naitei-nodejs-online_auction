import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext.jsx";
import { FaUser, FaKey, FaSignOutAlt, FaChevronDown } from "react-icons/fa";

export const UserAvatarDropdown = ({ isHomePage }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout, avatarUrl } = useUser();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsDropdownOpen(false);

    try {
      logout();
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/auth/login';
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleProfile = () => {
    setIsDropdownOpen(false);
    navigate('/profile');
  };

  const handleChangePassword = () => {
    setIsDropdownOpen(false);
    navigate('/auth/changePassword');
  };

  // Get user initials for fallback avatar
  const getUserInitials = (email) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 focus:outline-none"
        disabled={isLoggingOut}
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center bg-gray-200">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt="Avatar" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className={`w-full h-full flex items-center justify-center text-sm font-medium text-gray-600 ${avatarUrl ? 'hidden' : 'flex'}`}
          >
            {getUserInitials(user.email)}
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-1">
          <span className={`${!isHomePage ? "text-black" : "text-white"} font-medium text-sm hidden sm:block`}>
            Hello, {user.email}
          </span>
          <FaChevronDown 
            className={`${!isHomePage ? "text-black" : "text-white"} transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180' : ''
            }`} 
            size={12}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* Profile Option */}
          <button
            onClick={handleProfile}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors"
          >
            <FaUser className="text-gray-500" size={14} />
            <span>Profile</span>
          </button>

          {/* Change Password Option */}
          <button
            onClick={handleChangePassword}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors"
          >
            <FaKey className="text-gray-500" size={14} />
            <span>Change Password</span>
          </button>

          {/* Divider */}
          <div className="border-t border-gray-200 my-1"></div>

          {/* Logout Option */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-3 text-red-600 transition-colors disabled:opacity-50"
          >
            <FaSignOutAlt className="text-red-500" size={14} />
            <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserAvatarDropdown;
