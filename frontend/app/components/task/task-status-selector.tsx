import type { TaskStatus } from "@/types";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { useUpdateTaskStatusMutation } from "@/hooks/useTask";
import { toast } from "sonner";

export const TaskStatusSelector = ({ status, taskId }: { status: TaskStatus; taskId: string }) => {

    const { mutate, isPending } = useUpdateTaskStatusMutation();

    const handleStatusChange = (value: string | null) => {

        if (!value) {
            return;
        }

        mutate({ taskId, status: value as TaskStatus }, {
            onSuccess: () => {
                toast.success("Task status updated successfully");
            },
            onError: (error: any) => {
                const errorMessage = error?.response?.data?.message;
                toast.error(errorMessage);
                console.log("Error updating task status:", error);
            }
        });
    };

    return (
        <Select value={status || ""} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-45" disabled={isPending}>
                <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="To Do">To Do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
            </SelectContent>
        </Select>
    )
}