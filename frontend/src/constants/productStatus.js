import { IoCheckmarkCircleOutline, IoCloseCircleOutline, IoCartOutline, IoEyeOffOutline, IoRefreshOutline } from "react-icons/io5";

export const PRODUCT_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE', 
  SOLD: 'SOLD',
  REMOVED: 'REMOVED',
  DELETING: 'DELETING'
};

export const PRODUCT_STATUS_CONFIG = {
  [PRODUCT_STATUS.ACTIVE]: { 
    bg: "bg-green-100", 
    text: "text-green-800", 
    label: "Active",
    icon: IoCheckmarkCircleOutline,
    tooltip: "Product is available for sale"
  },
  [PRODUCT_STATUS.INACTIVE]: { 
    bg: "bg-red-100", 
    text: "text-red-800", 
    label: "Inactive",
    icon: IoCloseCircleOutline,
    tooltip: "Product is not available for sale"
  },
  [PRODUCT_STATUS.SOLD]: { 
    bg: "bg-yellow-100", 
    text: "text-yellow-800", 
    label: "Sold",
    icon: IoCartOutline,
    tooltip: "Product has been sold"
  },
  [PRODUCT_STATUS.REMOVED]: { 
    bg: "bg-gray-100", 
    text: "text-gray-800", 
    label: "Removed",
    icon: IoEyeOffOutline,
    tooltip: "Product has been removed from listings"
  },
  [PRODUCT_STATUS.DELETING]: { 
    bg: "bg-purple-100", 
    text: "text-purple-800", 
    label: "Deleting",
    icon: IoRefreshOutline,
    tooltip: "Product is being deleted",
    animateIcon: true
  }
};

export const getProductStatusConfig = (status) => {
  return PRODUCT_STATUS_CONFIG[status] || PRODUCT_STATUS_CONFIG[PRODUCT_STATUS.INACTIVE];
};
