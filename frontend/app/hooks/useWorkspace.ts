import type { WorkspaceForm } from "@/components/workspace/create-workspace";
import { deleteData, fetchData, postData, updateData } from "@/lib/fetchUtil";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateWorkSpace = () => {

    return useMutation({
        mutationFn: async (data: WorkspaceForm) => postData("/workspaces", data),
    });
};

export const useGetWorkspacesQuery = () => {
    return useQuery({
        queryKey: ["workspaces"],
        queryFn: async () => fetchData("/workspaces"),
    });
}

export const useGetWorkspaceQuery = (workspaceId: string) => {
    return useQuery({
        queryKey: ["workspace", workspaceId],
        queryFn: async () => fetchData(`/workspaces/${workspaceId}/projects`),
    });
};

export const useGetWorkspaceStatsQuery = (workspaceId: string) => {
    return useQuery({
        queryKey: ["workspace", workspaceId, "stats"],
        queryFn: async () => fetchData(`/workspaces/${workspaceId}/stats`),
        enabled: Boolean(workspaceId)
    });
}

export const useGetWorkspaceDetailsQuery = (workspaceId: string) => {
    return useQuery({
        queryKey: ["workspace", workspaceId, "details"],
        queryFn: async () => fetchData(`/workspaces/${workspaceId}`),
        enabled: Boolean(workspaceId)
    });
}

export const useGetArchivedItemsQuery = (workspaceId: string) => {
    return useQuery({
        queryKey: ["workspace", workspaceId, "archived"],
        queryFn: async () => fetchData(`/workspaces/${workspaceId}/archived`),
        enabled: Boolean(workspaceId)
    });
}

export const useUpdateWorkspaceMutation = () => {
    return useMutation({
        mutationFn: async ({ workspaceId, data }: { workspaceId: string; data: Partial<WorkspaceForm> }) =>
            updateData(`/workspaces/${workspaceId}`, data),
    });
};

export const useTransferWorkspaceOwnershipMutation = () => {
    return useMutation({
        mutationFn: async ({ workspaceId, newOwnerId }: { workspaceId: string; newOwnerId: string }) =>
            updateData(`/workspaces/${workspaceId}/transfer-ownership`, { newOwnerId }),
    });
};

export const useDeleteWorkspaceMutation = () => {
    return useMutation({
        mutationFn: async ({ workspaceId }: { workspaceId: string }) =>
            deleteData(`/workspaces/${workspaceId}`),
    });
};

export const useInviteMemberMutation = () => {
    return useMutation({
        mutationFn: async (data : { email: string; role: string; workspaceId: string }) =>
            postData(`/workspaces/${data.workspaceId}/invite-member`, data),
    });
}