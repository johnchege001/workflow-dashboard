"use client";

import { useEffect, useEffectEvent, useState } from "react";

import { REFRESH_SECONDS } from "@/lib/constants";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function useDashboardController({ currentUser, currentProfile, isAdmin }) {
  const supabase = getSupabaseBrowserClient();

  const [workflows, setWorkflows] = useState([]);
  const [errors, setErrors] = useState([]);
  const [trendErrors, setTrendErrors] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("\u2014");
  const [countdownPercent, setCountdownPercent] = useState(100);
  const [loadError, setLoadError] = useState("");
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [modalErrors, setModalErrors] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [lastLoadedAt, setLastLoadedAt] = useState(null);

  const loadAll = useEffectEvent(async () => {
    if (!currentUser || !currentProfile || refreshing) {
      return;
    }

    setRefreshing(true);

    try {
      const ownerName = currentProfile?.full_name || "";
      const ownerEmail = currentUser?.email || "";

      let workflowQuery = supabase
        .from("workflows")
        .select("*")
        .order("workflow_name", { ascending: true });

      if (!isAdmin) {
        workflowQuery = workflowQuery.or(`"Workflow Owner".eq.${ownerName},"Workflow Owner".eq.${ownerEmail}`);
      }

      const { data: workflowData, error: workflowError } = await workflowQuery;
      if (workflowError) throw workflowError;

      const workflowIds = (workflowData || []).map((workflow) => workflow.workflow_id);
      const noResults = !isAdmin && workflowIds.length === 0;

      let errorQuery = supabase
        .from("workflow_errors")
        .select("*, workflows(workflow_name)")
        .order("occurred_at", { ascending: false })
        .limit(50);

      if (!isAdmin && workflowIds.length > 0) {
        errorQuery = errorQuery.in("workflow_id", workflowIds);
      } else if (noResults) {
        errorQuery = errorQuery.eq("workflow_id", "__none__");
      }

      const { data: errorData, error: recentErrorsError } = await errorQuery;
      if (recentErrorsError) throw recentErrorsError;

      const cutoff30 = new Date(Date.now() - 30 * 86400000).toISOString();
      let trendQuery = supabase
        .from("workflow_errors")
        .select("occurred_at")
        .gte("occurred_at", cutoff30);

      if (!isAdmin && workflowIds.length > 0) {
        trendQuery = trendQuery.in("workflow_id", workflowIds);
      } else if (noResults) {
        trendQuery = trendQuery.eq("workflow_id", "__none__");
      }

      const { data: trendData, error: trendError } = await trendQuery;
      if (trendError) throw trendError;

      setWorkflows(workflowData || []);
      setErrors(errorData || []);
      setTrendErrors(trendData || []);
      setLoadError("");
      setLastUpdated(
        `Updated ${new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}`,
      );
    } catch (error) {
      console.error(error);
      setLoadError(error.message || "Failed to load data.");
      setLastUpdated("Error loading data");
    } finally {
      setRefreshing(false);
      setLastLoadedAt(Date.now());
      setCountdownPercent(100);
    }
  });

  const openWorkflow = useEffectEvent(async (workflowId) => {
    const fallbackWorkflow =
      workflows.find((workflow) => workflow.workflow_id === workflowId) ?? null;

    setSelectedWorkflow(fallbackWorkflow);
    setModalErrors([]);
    setModalLoading(true);

    try {
      const [{ data: workflowData }, { data: workflowErrors }] = await Promise.all([
        supabase.from("workflows").select("*").eq("workflow_id", workflowId).maybeSingle(),
        supabase
          .from("workflow_errors")
          .select("*")
          .eq("workflow_id", workflowId)
          .order("occurred_at", { ascending: false })
          .limit(20),
      ]);

      setSelectedWorkflow(workflowData || fallbackWorkflow);
      setModalErrors(workflowErrors || []);
    } finally {
      setModalLoading(false);
    }
  });

  useEffect(() => {
    if (!currentUser || !currentProfile) {
      setWorkflows([]);
      setErrors([]);
      setTrendErrors([]);
      setRefreshing(false);
      setLastUpdated("\u2014");
      setCountdownPercent(100);
      setLoadError("");
      setSelectedWorkflow(null);
      setModalErrors([]);
      setModalLoading(false);
      setLastLoadedAt(null);
      return;
    }

    void loadAll();
  }, [
    currentProfile?.full_name,
    currentProfile?.id,
    currentProfile?.role,
    currentUser?.email,
    currentUser?.id,
    isAdmin,
    loadAll,
  ]);

  useEffect(() => {
    if (!currentUser || !lastLoadedAt) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - lastLoadedAt) / 1000);
      const remaining = Math.max(REFRESH_SECONDS - elapsedSeconds, 0);
      setCountdownPercent((remaining / REFRESH_SECONDS) * 100);

      if (remaining <= 0) {
        void loadAll();
      }
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [currentUser, lastLoadedAt, loadAll]);

  function closeWorkflow() {
    setSelectedWorkflow(null);
    setModalErrors([]);
    setModalLoading(false);
  }

  return {
    countdownPercent,
    errors,
    lastUpdated,
    loadError,
    modalErrors,
    modalLoading,
    refreshing,
    selectedWorkflow,
    trendErrors,
    workflows,
    closeWorkflow,
    loadAll: () => void loadAll(),
    openWorkflow: (workflowId) => void openWorkflow(workflowId),
  };
}
