import React from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";

const icons = {
  success: <FaCheckCircle className="text-white" size={16} />,
  error: <FaTimesCircle className="text-white" size={16} />,
  warning: <FaExclamationTriangle className="text-white" size={16} />,
  info: <FaInfoCircle className="text-white" size={16} />,
};

const bgColors = {
  success: "bg-green-500",
  error: "bg-red-500", 
  warning: "bg-yellow-500",
  info: "bg-blue-500",
};

const Toast = ({ message, type = "info" }) => {
  const icon = icons[type] || icons.info;
  const bgColor = bgColors[type] || bgColors.info;

  return (
    <div
      className={`flex items-center gap-3 rounded-lg shadow-lg px-4 py-3 text-sm text-white min-w-[280px] max-w-[400px] ${bgColor} backdrop-blur-sm`}
    >
      {icon}
      <span className="font-medium">{message}</span>
    </div>
  );
};

export default Toast;
