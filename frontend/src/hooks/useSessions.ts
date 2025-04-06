import { Session } from "@/types";
import { getSessions } from "../lib/api";
import { QueryOptions, useQuery } from "@tanstack/react-query";

export const SESSIONS = "sessions";

const useSessions = (opts: QueryOptions = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: [SESSIONS],
    queryFn: getSessions,
    ...opts,
  });

  const sessions = (data as Session[]) || [];

  return { sessions, ...rest };
};

export default useSessions;
