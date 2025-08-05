import React from "react";

export const LoadingSpinner = ({ size = "default", text = "Loading..." }) => {
  const sizeClasses = {
    small: "h-4 w-4",
    default: "h-12 w-12",
    large: "h-16 w-16"
  };

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className={`animate-spin rounded-full border-b-2 border-green-600 mx-auto ${sizeClasses[size]}`}></div>
        <p className="mt-4 text-gray-600">{text}</p>
      </div>
    </div>
  );
};
