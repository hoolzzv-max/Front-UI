import { useMemo } from "react";
import { useLogsStore } from "../store/logsStore";

export function useLogs() {
  const store = useLogsStore();

  const filteredLogs = useMemo(() => {
    if (store.filter === "all") return store.logs;

    return store.logs.filter((log) => log.level === store.filter);
  }, [store.filter, store.logs]);

  return {
    ...store,
    filteredLogs,
  };
}
