import { useState, useEffect } from "react";
import {
  getBranches,
  // createBranch as createBranchService,
  // updateBranch as updateBranchService,
  // deleteBranch as deleteBranchService,
} from "../services/branchClinicService";

export function useBranches() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBranches = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBranches();
      setBranches(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
      setBranches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  return { branches, loading, error, refetch: fetchBranches };
}

