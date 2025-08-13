import { useState, useEffect, useCallback } from 'react';
import { useUser } from "@/contexts/UserContext.jsx";
import { userService } from "@/services/user.service.js";

export const useUserWarnings = () => {
  const { user } = useUser();
  const [warnings, setWarnings] = useState([]);
  const [warningStatus, setWarningStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUserWarnings = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError("");
      const data = await userService.getUserWarnings(user.id);
      setWarnings(data.warnings || []);
      setWarningStatus({
        warningCount: data.warningCount || 0,
        isBanned: data.isBanned || false,
        message: data.message || ""
      });
    } catch (err) {
      console.error('Failed to fetch user warnings:', err);
      setError(err.message || 'Failed to load warnings');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchUserWarnings();
  }, [fetchUserWarnings]);

  return {
    warnings,
    warningStatus,
    loading,
    error,
    refreshWarnings: fetchUserWarnings
  };
};
