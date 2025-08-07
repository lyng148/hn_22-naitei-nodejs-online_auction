import React from "react";
import { Title } from "@/components/ui/index.js";

const ComingSoon = ({ title }) => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center py-12">
        <Title level={2} className="text-3xl font-bold text-gray-900 mb-4">
          {title} Management
        </Title>
        <p className="text-gray-600 text-lg">
          {title} management functionality will be implemented here.
        </p>
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Coming Soon</h3>
          <p className="text-gray-600">
            This section will allow you to manage {title.toLowerCase()} related features, 
            including monitoring, analytics, and administrative controls.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
