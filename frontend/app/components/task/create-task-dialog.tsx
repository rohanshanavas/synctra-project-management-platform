import { useCreateTaskMutation } from "@/hooks/useTask";
import { createTaskSchema } from "@/lib/schema";
import type { ProjectMemberRole, User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Field, FieldContent, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { Checkbox } from "../ui/checkbox";

interface CreateTaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string;
    projectMembers: { user: User; role: ProjectMemberRole }[];
}

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;

export const CreateTaskDialog = ({ open, onOpenChange, projectId, projectMembers }: CreateTaskDialogProps) => {

    const form = useForm<CreateTaskFormData>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            title: "",
            description: "",
            status: "To Do",
            priority: "Medium",
            dueDate: "",
            assignees: []
        }
    });

    const { mutate, isPending } = useCreateTaskMutation();

    const onSubmit = (values: CreateTaskFormData) => {
        mutate({ taskData: values, projectId }, {
            onSuccess: () => {
                toast.success("Task created successfully");
                form.reset();
                onOpenChange(false);
            },
            onError: (error: any) => {
                const errorMessage = error.response?.data?.message;
                console.log("Error creating task:", errorMessage);
                toast.error(errorMessage);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Task</DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Controller
                                name="title"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Title</FieldLabel>
                                        <FieldContent>
                                            <Input
                                                placeholder="Enter Task Title"
                                                {...field}
                                            />
                                        </FieldContent>
                                        <FieldError errors={[fieldState.error]} />
                                    </Field>
                                )}
                            />
                            <Controller
                                name="description"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Description</FieldLabel>
                                        <FieldContent>
                                            <Textarea
                                                placeholder="Enter Task Description"
                                                {...field}
                                            />
                                        </FieldContent>
                                        <FieldError errors={[fieldState.error]} />
                                    </Field>
                                )}
                            />

                            <div className="grid gap-4 md:grid-cols-2">
                                <Controller
                                    name="status"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field>
                                            <FieldLabel>Status</FieldLabel>
                                            <FieldContent>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select Status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="To Do">To Do</SelectItem>
                                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                                        <SelectItem value="Review">Review</SelectItem>
                                                        <SelectItem value="Done">Done</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FieldContent>
                                            <FieldError errors={[fieldState.error]} />
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="priority"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field>
                                            <FieldLabel>Priority</FieldLabel>
                                            <FieldContent>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select Priority" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Low">Low</SelectItem>
                                                        <SelectItem value="Medium">Medium</SelectItem>
                                                        <SelectItem value="High">High</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FieldContent>
                                            <FieldError errors={[fieldState.error]} />
                                        </Field>
                                    )}
                                />
                            </div>

                            <Controller
                                name="dueDate"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Description</FieldLabel>
                                        <FieldContent>
                                            <Popover>
                                                <PopoverTrigger>
                                                    <Button variant="outline" className={"w-full justify-start text-left font-normal"
                                                        + (!field.value ? " text-muted-foreground" : "")}>
                                                        <CalendarIcon className="mr-2 size-4" />
                                                        {field.value ? format(new Date(field.value), "PPPP") : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value ? new Date(field.value) : undefined}
                                                        onSelect={(date) => {
                                                            field.onChange(date?.toISOString() || undefined);
                                                        }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FieldContent>
                                        <FieldError errors={[fieldState.error]} />
                                    </Field>
                                )}
                            />

                            <Controller
                                name="assignees"
                                control={form.control}
                                render={({ field, fieldState }) => {

                                    const selectedMembers = field.value || [];

                                    return (
                                        <Field>
                                            <FieldLabel>Assignees</FieldLabel>
                                            <FieldContent>
                                                <Popover>
                                                    <PopoverTrigger>
                                                        <Button variant="outline" className="w-full justify-start text-left font-normal min-h-11">
                                                            {selectedMembers.length === 0 ? (
                                                                <span className="text-muted-foreground">Select Assignees</span>
                                                            ) : (
                                                                selectedMembers.length <= 2 ? (
                                                                    selectedMembers.map((m) => {
                                                                        const member = projectMembers.find((projectMember) => projectMember.user._id === m);
                                                                        return `${member?.user.name}`;
                                                                    }).join(", ")
                                                                ) : (
                                                                    `${selectedMembers.length} assignees selected`
                                                                )
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-sm max-w-60 overflow-y-auto p-2" align="start">
                                                        <div className="flex flex-col gap-2">
                                                            {projectMembers.map((member) => {
                                                                const selectedMember = selectedMembers.find((m) => m === member.user?._id);
                                                                return (
                                                                    <div key={member.user._id} className="flex items-center gap-2 p-2 border rounded">
                                                                        <Checkbox
                                                                            checked={!!selectedMember}
                                                                            onCheckedChange={(checked) => {
                                                                                if (checked) {
                                                                                    field.onChange([...selectedMembers, member.user._id]);
                                                                                }
                                                                                else {
                                                                                    field.onChange(selectedMembers.filter((m) => m !== member.user._id));
                                                                                }
                                                                            }}
                                                                            id={`member-${member.user._id}`}
                                                                        />
                                                                        <span className="truncate flex-1">
                                                                            {member.user.name}
                                                                        </span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </FieldContent>
                                            <FieldError errors={[fieldState.error]} />
                                        </Field>
                                    )
                                }}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Creating..." : "Create Task"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}