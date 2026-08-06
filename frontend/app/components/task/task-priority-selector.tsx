import type { TaskPriority } from "@/types";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { useUpdateTaskPriorityMutation } from "@/hooks/useTask";
import { toast } from "sonner";

export const TaskPrioritySelector = ({ priority, taskId }: { priority: TaskPriority; taskId: string }) => {

    const { mutate, isPending } = useUpdateTaskPriorityMutation();

    const handlePriorityChange = (value: string | null) => {

        if (!value) {
            return;
        }

        mutate({ taskId, priority: value as TaskPriority }, {
            onSuccess: () => {
                toast.success("Task priority updated successfully");
            },
            onError: (error: any) => {
                const errorMessage = error?.response?.data?.message;
                toast.error(errorMessage);
                console.log("Error updating task priority:", error);
            }
        });
    };

    return (
        <Select value={priority || ""} onValueChange={handlePriorityChange}>
            <SelectTrigger className="w-45" disabled={isPending}>
                <SelectValue placeholder="Select a priority" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
            </SelectContent>
        </Select>
    )
}