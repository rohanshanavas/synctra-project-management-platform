import type { CreateTaskFormData } from "@/components/task/create-task-dialog";
import { fetchData, postData, updateData } from "@/lib/fetchUtil";
import type { TaskPriority, TaskStatus } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateTaskMutation = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { taskData: CreateTaskFormData; projectId: string }) =>
            postData(`/tasks/${data.projectId}/create-task`, data.taskData),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ["project", data.project] });
        }
    });
};

export const useTaskbyIdQuery = (taskId: string) => {

    return useQuery({
        queryKey: ["task", taskId],
        queryFn: () => fetchData(`/tasks/${taskId}`)
    });
};

export const useUpdateTaskTitleMutation = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { taskId: string; title: string }) =>
            updateData(`/tasks/${data.taskId}/title`, { title: data.title }),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ["task", data._id] });
        }
    });
};

export const useUpdateTaskStatusMutation = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { taskId: string; status: TaskStatus }) =>
            updateData(`/tasks/${data.taskId}/status`, { status: data.status }),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ["task", data._id] });
        }
    });
};

export const useUpdateTaskDescriptionMutation = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { taskId: string; description: string }) =>
            updateData(`/tasks/${data.taskId}/description`, { description: data.description }),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ["task", data._id] });
        }
    });
};

export const useUpdateTaskAssigneesMutation = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { taskId: string; assignees: string[] }) =>
            updateData(`/tasks/${data.taskId}/assignees`, { assignees: data.assignees }),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ["task", data._id] });
        }
    });
}

export const useUpdateTaskPriorityMutation = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { taskId: string; priority: TaskPriority }) =>
            updateData(`/tasks/${data.taskId}/priority`, { priority: data.priority }),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ["task", data._id] });
        }
    });
}