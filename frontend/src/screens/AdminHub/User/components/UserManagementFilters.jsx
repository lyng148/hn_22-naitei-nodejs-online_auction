import React, { useState, useEffect } from "react";
import { 
  IoSearchOutline, 
  IoChevronDownOutline, 
  IoFilterOutline, 
  IoCloseOutline,
  IoCheckmarkOutline,
  IoCalendarOutline,
  IoSwapVerticalOutline,
  IoRefreshOutline
} from "react-icons/io5";

const UserManagementFilters = ({
  searchTerm,
  setSearchTerm,
  period,
  setPeriod,
  searchBy,
  setSearchBy,
  sortBy,
  setSortBy,
  sortOrder = "desc",
  setSortOrder,
  statusFilter = "all",
  setStatusFilter,
  onClearFilters
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [tempSearchTerm, setTempSearchTerm] = useState(searchTerm);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(tempSearchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [tempSearchTerm, setSearchTerm]);

  const periodOptions = [
    { value: "all", label: "All time" },
    { value: "today", label: "Today" },
    { value: "7days", label: "Last 7 days" },
    { value: "30days", label: "Last 30 days" },
    { value: "90days", label: "Last 90 days" },
    { value: "6months", label: "Last 6 months" },
    { value: "1year", label: "Last year" }
  ];

  const searchByOptions = [
    { value: "all", label: "All fields" },
    { value: "email", label: "Email" },
    { value: "fullName", label: "Full name" },
    { value: "phoneNumber", label: "Phone number" },
    { value: "userId", label: "User ID" }
  ];

  const sortByOptions = [
    { value: "createdAt", label: "Creation date" },
    { value: "lastActivity", label: "Last activity" },
    { value: "email", label: "Email" },
    { value: "fullName", label: "Full name" },
    { value: "phoneNumber", label: "Phone number" }
  ];

  const statusOptions = [
    { value: "all", label: "All users" },
    { value: "active", label: "Active" },
    { value: "banned", label: "Banned" },
    { value: "new", label: "New (7 days)" }
  ];

  const handleClearFilters = () => {
    setTempSearchTerm("");
    setSearchTerm("");
    setPeriod("all");
    setSearchBy("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setStatusFilter("all");
    if (onClearFilters) onClearFilters();
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const hasActiveFilters = searchTerm || period !== "all" || searchBy !== "all" || statusFilter !== "all";

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
      {/* Main Filter Row */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search Input */}
          <div className="flex items-center relative flex-1 min-w-[300px] max-w-md">
            <div className="relative w-full">
              <input
                type="text"
                placeholder={`Search by ${searchBy === "all" ? "any field" : searchByOptions.find(opt => opt.value === searchBy)?.label.toLowerCase()}...`}
                value={tempSearchTerm}
                onChange={(e) => setTempSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              />
              <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              {tempSearchTerm && (
                <button
                  onClick={() => setTempSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <IoCloseOutline size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Quick Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 min-w-[120px]"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <IoChevronDownOutline className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
            </div>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Sort:</span>
            <div className="flex items-center gap-1">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-l-lg px-3 py-2.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 min-w-[140px]"
                >
                  {sortByOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <IoChevronDownOutline className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              </div>
              <button
                onClick={toggleSortOrder}
                className="px-3 py-2.5 border border-l-0 border-gray-300 rounded-r-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
                title={`Sort ${sortOrder === "asc" ? "ascending" : "descending"}`}
              >
                <IoSwapVerticalOutline 
                  className={`transform transition-transform duration-200 ${sortOrder === "asc" ? "rotate-180" : ""}`} 
                  size={16} 
                />
              </button>
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center gap-2 px-3 py-2.5 border rounded-lg text-sm font-medium transition-all duration-200 ${
              showAdvancedFilters
                ? "bg-green-50 border-green-300 text-green-700"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <IoFilterOutline size={16} />
            Filters
            <IoChevronDownOutline 
              className={`transform transition-transform duration-200 ${showAdvancedFilters ? "rotate-180" : ""}`} 
              size={14} 
            />
          </button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-2 px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <IoRefreshOutline size={16} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Period Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <IoCalendarOutline size={16} />
                Registration Period
              </label>
              <div className="relative">
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="appearance-none w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {periodOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <IoChevronDownOutline className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              </div>
            </div>

            {/* Search By Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <IoSearchOutline size={16} />
                Search Field
              </label>
              <div className="relative">
                <select
                  value={searchBy}
                  onChange={(e) => setSearchBy(e.target.value)}
                  className="appearance-none w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {searchByOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <IoChevronDownOutline className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              </div>
            </div>

            {/* Filter Summary */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <IoCheckmarkOutline size={16} />
                Active Filters
              </label>
              <div className="flex flex-wrap gap-1">
                {hasActiveFilters ? (
                  <>
                    {searchTerm && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Search: "{searchTerm}"
                      </span>
                    )}
                    {period !== "all" && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {periodOptions.find(opt => opt.value === period)?.label}
                      </span>
                    )}
                    {statusFilter !== "all" && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {statusOptions.find(opt => opt.value === statusFilter)?.label}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-xs text-gray-500">No active filters</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementFilters;
