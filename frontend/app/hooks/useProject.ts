import type { CreateProjectFormData } from "@/components/project/create-project";
import { postData } from "@/lib/fetchUtil";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateProject = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: {
            projectData: CreateProjectFormData;
            workspaceId: string;
        }) =>
            postData(`/projects/${data.workspaceId}/create-project`, data.projectData),
        onSuccess: (data: any) => {
            console.log("Project created successfully", data);
            queryClient.invalidateQueries({ queryKey: ["workspace", data.workspace] });
        }
    });
};