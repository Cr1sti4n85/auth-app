import { Session } from "../types";
import { getSessions } from "../lib/api";
import { QueryOptions, useQuery } from "@tanstack/react-query";

export const SESSIONS = "sessions";

const useSessions = (opts: QueryOptions<Session[]> = {}) => {
  const { data: sessions = [], ...rest } = useQuery<Session[]>({
    queryKey: [SESSIONS],
    queryFn: getSessions,
    ...opts,
  });

  return { sessions, ...rest };
};

export default useSessions;
