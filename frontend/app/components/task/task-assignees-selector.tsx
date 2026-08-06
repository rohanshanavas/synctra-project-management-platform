import type { ProjectMemberRole, Task, User } from "@/types";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { useUpdateTaskAssigneesMutation } from "@/hooks/useTask";
import { toast } from "sonner";

export const TaskAssigneesSelector = ({ task, assignees, projectMembers }: { task: Task; assignees: User[]; projectMembers: { user: User, role: ProjectMemberRole }[] }) => {

    const { mutate, isPending } = useUpdateTaskAssigneesMutation();

    const [selectedIds, setSelectedIds] = useState<string[]>(assignees.map((assignee) => assignee._id));

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleSelectAll = () => {

        const allIds = projectMembers.map((member) => member.user._id);
        setSelectedIds(allIds);
    }

    const handleDeselectAll = () => {
        setSelectedIds([]);
    }

    const handleSelect = (userId: string) => {

        let newSelectedIds: string[] = [];

        if (selectedIds.includes(userId)) {
            newSelectedIds = selectedIds.filter((id) => id !== userId);
        } else {
            newSelectedIds = [...selectedIds, userId];
        }

        setSelectedIds(newSelectedIds);
    }

    const handleSave = () => {

        mutate({ taskId: task._id, assignees: selectedIds }, {
            onSuccess: () => {
                setDropdownOpen(false);
                toast.success("Task assignees updated successfully");
            },
            onError: (error: any) => {
                const errorMessage = error?.response?.data?.message;
                toast.error(errorMessage);
                console.log("Error updating task assignees:", errorMessage);
            }
        });
    }

    return (
        <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Assignees:
            </h3>
            <div className="flex flex-wrap gap-2 mb-2">
                {selectedIds.length === 0 ? (
                    <span className="text-xs text-muted-foreground">Unassigned</span>
                ) : (
                    projectMembers
                        .filter((member) => selectedIds.includes(member.user._id))
                        .map((member) => (
                            <div key={member.user._id} className="flex items-center bg-gray-100 px-2 py-1 rounded">
                                <Avatar className="size-6 mr-1">
                                    <AvatarImage src={member.user.profilePicture} />
                                    <AvatarFallback>
                                        {member.user.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-muted-foreground">
                                    {member.user.name}
                                </span>
                            </div>
                        ))
                )}
            </div>

            <div className="relative">
                <button className="text-sm text-muted-foreground w-full border rounded px-3 py-2 text-left bg-white" onClick={() => setDropdownOpen(!dropdownOpen)}>
                    {selectedIds.length === 0 ? "Select Assignees" : `${selectedIds.length} Assignee${selectedIds.length > 1 ? "s" : ""} selected`}
                </button>

                {dropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
                        <div className="flex justify-between px-2 py-1 border-b">
                            <button className="text-xs text-blue-600" onClick={handleSelectAll}>Select All</button>
                            <button className="text-xs text-red-600" onClick={handleDeselectAll}>Deselect All</button>
                        </div>
                        {projectMembers.map((member) => (
                            <label key={member.user._id} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer" onClick={() => {
                                if (selectedIds.includes(member.user._id)) {
                                    setSelectedIds(selectedIds.filter((id) => id !== member.user._id));
                                } else {
                                    setSelectedIds([...selectedIds, member.user._id]);
                                }
                            }}>
                                <Checkbox checked={selectedIds.includes(member.user._id)} onCheckedChange={() => handleSelect(member.user._id)} className="mr-2" />
                                <Avatar className="size-6 mr-2">
                                    <AvatarImage src={member.user.profilePicture} />
                                    <AvatarFallback>
                                        {member.user.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <span>{member.user.name}</span>
                            </label>
                        ))}

                        <div className="flex justify-between px-2 py-1">
                            <Button variant="outline" size="sm" className="font-light" onClick={() => setDropdownOpen(false)} disabled={isPending}>
                                Cancel
                            </Button>
                            <Button size="sm" className="font-light" onClick={() => handleSave()} disabled={isPending}>
                                Save
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}