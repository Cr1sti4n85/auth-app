import { getUser } from "../lib/api";
import { QueryOptions, useQuery } from "@tanstack/react-query";

export const AUTH = "auth";

const useAuth = (opts: QueryOptions = {}) => {
  const { data: user, ...rest } = useQuery({
    queryKey: [AUTH],
    queryFn: getUser,
    staleTime: Infinity, //it's never gonna refetch the user. it fetches just once,
    // and the user will be stored in cache under the AUTH query key
    ...opts,
  });

  return { user, ...rest };
};

export default useAuth;
