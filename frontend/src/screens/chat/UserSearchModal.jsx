import React, { useState, useEffect, useCallback } from "react";
import {
    IoSearchOutline,
    IoCloseOutline,
    IoPersonOutline,
    IoCheckmarkCircleOutline,
    IoAmericanFootballOutline
} from "react-icons/io5";
import { PrimaryButton, SecondaryButton } from "@/components/ui/index.js";
import { userManagementService } from "@/services/userManagement.service.js";

const UserSearchModal = ({
    isOpen,
    onClose,
    onSelectUser,
    isLoading = false
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchBy, setSearchBy] = useState("all");
    const [users, setUsers] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    const searchUsers = useCallback(async (term, searchField) => {
        if (!term.trim() || term.trim().length < 2) {
            setUsers([]);
            setHasSearched(false);
            return;
        }

        setIsSearching(true);
        try {
            // Get all users first (you might want to implement server-side search)
            const response = await userManagementService.listUsers(null, 1, 100);

            // Filter users based on search term and field
            const filteredUsers = response.users.filter(user => {
                const searchLower = term.toLowerCase();
                switch (searchField) {
                    case "email":
                        return user.email?.toLowerCase().includes(searchLower);
                    case "fullName":
                        return user.profile?.fullName?.toLowerCase().includes(searchLower);
                    case "phoneNumber":
                        return user.profile?.phoneNumber?.includes(term);
                    case "userId":
                        return user.userId?.toString().includes(term);
                    case "all":
                        return (
                            user.email?.toLowerCase().includes(searchLower) ||
                            user.profile?.fullName?.toLowerCase().includes(searchLower) ||
                            user.profile?.phoneNumber?.includes(term) ||
                            user.userId?.toString().includes(term)
                        );
                    default:
                        return true;
                }
            });

            setUsers(filteredUsers);
            setHasSearched(true);
        } catch (error) {
            console.error('Error searching users:', error);
            setUsers([]);
            setHasSearched(true);
        } finally {
            setIsSearching(false);
        }
    }, []);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            searchUsers(searchTerm, searchBy);
        }, 500); // Tăng debounce time từ 300ms lên 500ms

        return () => clearTimeout(timer);
    }, [searchTerm, searchBy, searchUsers]);

    const handleUserSelect = (user) => {
        setSelectedUser(user);
    };

    const handleConfirm = () => {
        if (selectedUser) {
            onSelectUser(selectedUser);
            // Reset state và đóng modal
            setSearchTerm("");
            setUsers([]);
            setSelectedUser(null);
            setHasSearched(false);
            onClose();
        }
    };

    const handleClose = () => {
        setSearchTerm("");
        setUsers([]);
        setSelectedUser(null);
        setHasSearched(false);
        onClose();
    };

    if (!isOpen) return null;

    const searchByOptions = [
        { value: "all", label: "All fields" },
        { value: "email", label: "Email" },
        { value: "fullName", label: "Full name" },
        { value: "phoneNumber", label: "Phone number" },
        { value: "userId", label: "User ID" }
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl mx-4 h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                            <IoPersonOutline className="text-emerald-600" size={20} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Start New Chat</h3>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={isLoading}
                    >
                        <IoCloseOutline size={24} />
                    </button>
                </div>

                {/* Search Controls */}
                <div className="p-6 border-b border-gray-200 flex-shrink-0">
                    <div className="flex flex-col space-y-4">
                        {/* Search Field Selector */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search by:
                            </label>
                            <select
                                value={searchBy}
                                onChange={(e) => setSearchBy(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                {searchByOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Search Input */}
                        <div className="relative">
                            <IoSearchOutline
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={20}
                            />
                            <input
                                type="text"
                                placeholder={`Search by ${searchBy === "all" ? "any field" : searchByOptions.find(opt => opt.value === searchBy)?.label.toLowerCase()}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                                autoFocus
                            />
                        </div>
                    </div>
                </div>

                {/* Search Results */}
                <div className="flex-1 overflow-hidden relative">
                    <div className="h-full overflow-y-auto p-6">
                        {isSearching ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                                <span className="ml-2 text-gray-600">Searching...</span>
                            </div>
                        ) : hasSearched ? (
                            users.length > 0 ? (
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600 mb-4">Found {users.length} user(s)</p>
                                    {users.map((user) => (
                                        <div
                                            key={user.userId}
                                            onClick={() => handleUserSelect(user)}
                                            className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedUser?.userId === user.userId
                                                ? 'border-emerald-500 bg-emerald-50'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            {/* Avatar */}
                                            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                                {user.profile?.profileImageUrl ? (
                                                    <img
                                                        src={user.profile.profileImageUrl}
                                                        alt="Avatar"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-purple-500 flex items-center justify-center">
                                                        <span className="text-white font-medium text-lg">
                                                            {(user.profile?.fullName || user.email)?.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* User Info and Chat Button */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center space-x-2">
                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                {user.profile?.fullName || 'No name'}
                                                            </p>
                                                            {user.isVerified && (
                                                                <IoCheckmarkCircleOutline className="text-green-500 flex-shrink-0" size={16} />
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                                                            <span>ID: {user.userId.substring(0, 8)}...</span>
                                                            {user.profile?.phoneNumber && (
                                                                <span>Phone: {user.profile.phoneNumber}</span>
                                                            )}
                                                            <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'SELLER' ? 'bg-purple-100 text-purple-800' :
                                                                user.role === 'BIDDER' ? 'bg-green-100 text-green-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                {user.role}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Chat Button */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedUser(user);
                                                            handleConfirm();
                                                        }}
                                                        className="ml-3 px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex-shrink-0"
                                                        disabled={isLoading}
                                                    >

                                                        Chat
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Selection Indicator */}
                                            {selectedUser?.userId === user.userId && (
                                                <IoCheckmarkCircleOutline className="text-emerald-500 flex-shrink-0 ml-2" size={20} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <IoPersonOutline className="mx-auto text-gray-400 mb-4" size={48} />
                                    <p className="text-gray-500">No users found</p>
                                    <p className="text-sm text-gray-400">Try adjusting your search terms</p>
                                </div>
                            )
                        ) : searchTerm.trim() && searchTerm.trim().length < 2 ? (
                            <div className="text-center py-8">
                                <IoSearchOutline className="mx-auto text-gray-400 mb-4" size={48} />
                                <p className="text-gray-500">Type at least 2 characters to search</p>
                                <p className="text-sm text-gray-400">Enter a name, email, phone number, or user ID</p>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <IoSearchOutline className="mx-auto text-gray-400 mb-4" size={48} />
                                <p className="text-gray-500">Search for users to start a chat</p>
                                <p className="text-sm text-gray-400">Enter a name, email, phone number, or user ID</p>
                            </div>
                        )}
                    </div>

                    {/* Loading Overlay */}
                    {isSearching && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                            <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                                <span className="text-gray-600 font-medium">Searching...</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end p-6 border-t border-gray-200 flex-shrink-0">
                    <SecondaryButton
                        onClick={handleClose}
                        disabled={isLoading}
                        className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg"
                    >
                        Cancel
                    </SecondaryButton>
                    <PrimaryButton
                        onClick={handleConfirm}
                        disabled={isLoading || !selectedUser}
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Starting Chat...
                            </>
                        ) : (
                            'Start Chat'
                        )}
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
};

export default UserSearchModal;
