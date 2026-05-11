import useSWR from "swr";
import { api } from "@/lib/api";

export function useAuth() {
  const { data: user, error, isLoading } = useSWR("/users/me", (url) =>
    api.get(url).then((res) => res.data)
  );

  return {
    user,
    isLoading,
    isError: !!error,
  };
}

export function useResumes() {
  const { data: resumes, error, isLoading, mutate } = useSWR("/resume/mine", (url) =>
    api.get(url).then((res) => res.data)
  );

  return {
    resumes,
    isLoading,
    isError: !!error,
    mutate,
  };
}

export function useInterviewHistory() {
  const { data: history, error, isLoading } = useSWR("/interview/history", (url) =>
    api.get(url).then((res) => res.data)
  );

  return {
    history,
    isLoading,
    isError: !!error,
  };
}

export function useAnalytics() {
  const { data: analytics, error, isLoading } = useSWR("/analytics/summary", (url) =>
    api.get(url).then((res) => res.data)
  );

  return {
    analytics,
    isLoading,
    isError: !!error,
  };
}
