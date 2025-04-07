import { Session } from "../types";
import { deleteSession } from "../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SESSIONS } from "./useSessions";

export const useDeleteSession = (sessionId: string) => {
  const queryClient = useQueryClient();
  const { mutate, ...rest } = useMutation({
    mutationFn: () => deleteSession(sessionId),
    //we need to update the cache in order to see the change in frontend
    onSuccess: () => {
      queryClient.setQueryData([SESSIONS], (oldData: Session[]) =>
        oldData.filter((session) => session._id !== sessionId)
      );
    },
  });

  return { deleteSession: mutate, ...rest };
};
