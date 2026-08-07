import type { Subtask } from "@/types";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAddSubtaskMutation, useUpdateSubtaskMutation } from "@/hooks/useTask";
import { toast } from "sonner";

export const SubTaskDetails = ({ taskId, subtasks }: { taskId: string; subtasks: Subtask[] }) => {

    const [newSubtask, setNewSubtask] = useState("");

    const { mutate: addSubtask, isPending: isAddingSubtask } = useAddSubtaskMutation();
    const { mutate: updateSubtask, isPending: isUpdatingSubtask } = useUpdateSubtaskMutation();

    const handleToggleSubtask = (subtaskId: string, checked: boolean) => {
        updateSubtask({ taskId, subtaskId, completed: checked }, {
            onSuccess: () => {
                toast.success("Subtask updated successfully");
            },
            onError: (error: any) => {
                const errorMessage = error?.response?.data?.message;
                toast.error(errorMessage);
                console.log("Error updating subtask:", error);
            }
        });
    };

    const handleAddSubtask = () => {
        addSubtask({ taskId, title: newSubtask }, {
            onSuccess: () => {
                setNewSubtask("");
                toast.success("Subtask added successfully");
            },
            onError: (error: any) => {
                const errorMessage = error?.response?.data?.message;
                toast.error(errorMessage);
                console.log("Error adding subtask:", error);
            }
        });
    }

    return (
        <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-0">
                Subtasks
            </h3>

            <div className="space-y-2 mb-4">
                {subtasks.length > 0 ? (
                    subtasks.map((subtask) => (
                        <div key={subtask._id} className="flex items-center space-x-2">
                            <Checkbox
                                id={subtask._id}
                                checked={subtask.completed}
                                onCheckedChange={(checked) => handleToggleSubtask(subtask._id, !!checked)}
                                disabled={isUpdatingSubtask}
                            />
                            <label className={cn("text-sm", subtask.completed ? "line-through text-muted-foreground" : "")}>
                                {subtask.title}
                            </label>
                        </div>
                    ))
                ) : (
                    <div className="text-sm text-muted-foreground">No subtasks available</div>
                )}
            </div>

            <div className="flex space-x-2">
                <Input
                    className="mr-1"
                    placeholder="Add a new subtask"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    disabled={isAddingSubtask}
                />

                <Button onClick={handleAddSubtask} disabled={isAddingSubtask || newSubtask.length === 0}>
                    Add
                </Button>
            </div>
        </div>
    )
}