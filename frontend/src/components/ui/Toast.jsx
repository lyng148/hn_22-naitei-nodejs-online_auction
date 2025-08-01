import React from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";

const icons = {
  success: <FaCheckCircle className="text-green-600" size={20} />,
  error: <FaTimesCircle className="text-red-600" size={20} />,
  warning: <FaExclamationTriangle className="text-yellow-600" size={20} />,
  info: <FaInfoCircle className="text-blue-600" size={20} />,
};

const bgColors = {
  success: "bg-green-100 text-green-800 border-green-500",
  error: "bg-red-100 text-red-800 border-red-500",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-500",
  info: "bg-blue-100 text-blue-800 border-blue-500",
};

const Toast = ({ message, type = "info" }) => {
  const icon = icons[type] || icons.info;
  const bgColor = bgColors[type] || bgColors.info;

  return (
    <div
      className={`flex items-center gap-2 rounded-lg shadow-md px-4 py-2 text-sm border-l-4 ${bgColor}`}
    >
      {icon}
      <span>{message}</span>
    </div>
  );
};

export default Toast;
