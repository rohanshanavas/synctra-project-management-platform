import type { WorkspaceForm } from "@/components/workspace/create-workspace";
import { postData } from "@/lib/fetchUtil";
import { useMutation } from "@tanstack/react-query";

export const useCreateWorkSpace = () => {

    return useMutation({
        mutationFn: async (data: WorkspaceForm) => postData("/workspaces", data),
    });
};