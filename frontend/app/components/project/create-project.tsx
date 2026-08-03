import { projectSchema } from "@/lib/schema";
import { ProjectStatus, type MemberProps } from "@/types";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Field, FieldContent, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Checkbox } from "../ui/checkbox";
import { useCreateProject } from "@/hooks/useProject";
import { toast } from "sonner";

interface CreateProjectDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    workspaceId: string;
    workspaceMembers: MemberProps[];
}

export type CreateProjectFormData = z.infer<typeof projectSchema>;

export const CreateProjectDialog = ({ isOpen, onOpenChange, workspaceId, workspaceMembers }: CreateProjectDialogProps) => {

    const form = useForm<CreateProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: "",
            description: "",
            status: ProjectStatus.PLANNING,
            startDate: "",
            dueDate: "",
            members: [],
            tags: undefined,
        },
    });

    const { mutate, isPending } = useCreateProject();

    const onSubmit = (values: CreateProjectFormData) => {

        if (!workspaceId) {
            console.log("Workspace ID is not available");
            return;
        }

        mutate({ workspaceId, projectData: values }, {
            onSuccess: () => {
                toast.success("Project created successfully");
                form.reset();
                onOpenChange(false);
            },
            onError: (error: any) => {
                const errorMessage = error?.response?.data?.message;
                toast.error(errorMessage);
                console.log("Error creating project:", error);
            }
        });
    };

    return (
        <div>
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-135">
                    <DialogHeader>
                        <DialogTitle>Create Project</DialogTitle>
                        <DialogDescription>Create a new project to get started</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <Controller
                            name="title"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>Project Title</FieldLabel>
                                    <FieldContent>
                                        <Input
                                            type="text"
                                            placeholder="Project Title"
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
                                    <FieldLabel>Project Description</FieldLabel>
                                    <FieldContent>
                                        <Textarea
                                            placeholder="Project Description"
                                            {...field}
                                            rows={3}
                                        />
                                    </FieldContent>
                                    <FieldError errors={[fieldState.error]} />
                                </Field>
                            )}
                        />
                        <Controller
                            name="status"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>Project Status</FieldLabel>
                                    <FieldContent>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Project Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.values(ProjectStatus).map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        {status}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FieldContent>
                                    <FieldError errors={[fieldState.error]} />
                                </Field>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Controller
                                name="startDate"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Start Date</FieldLabel>
                                        <FieldContent>
                                            <Popover modal={true}>
                                                <PopoverTrigger>
                                                    <Button variant="outline" className={"w-full justify-start text-left font-normal" +
                                                        (!field.value ? " text-muted-foreground" : "")}>
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
                                name="dueDate"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Due Date</FieldLabel>
                                        <FieldContent>
                                            <Popover modal={true}>
                                                <PopoverTrigger>
                                                    <Button variant="outline" className={"w-full justify-start text-left font-normal" +
                                                        (!field.value ? " text-muted-foreground" : "")}>
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
                        </div>
                        <Controller
                            name="tags"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>Project Tags</FieldLabel>
                                    <FieldContent>
                                        <Input
                                            type="text"
                                            placeholder="Tags separated by commas"
                                            {...field}
                                        />
                                    </FieldContent>
                                    <FieldError errors={[fieldState.error]} />
                                </Field>
                            )}
                        />
                        <Controller
                            name="members"
                            control={form.control}
                            render={({ field, fieldState }) => {

                                const selectedMembers = field.value || [];

                                return (
                                    <Field>
                                        <FieldLabel>Project Members</FieldLabel>
                                        <FieldContent>
                                            <Popover>
                                                <PopoverTrigger>
                                                    <Button variant="outline" className="w-full justify-start text-left font-normal min-h-11">
                                                        {selectedMembers.length === 0 ? (
                                                            <span className="text-muted-foreground">Select Members</span>
                                                        ) : (
                                                            selectedMembers.length <= 2 ? (
                                                                selectedMembers.map(m => {
                                                                    const member = workspaceMembers.find(workspaceMember => workspaceMember.user._id === m.user);
                                                                    return `${member?.user.name} (${member?.role})`;
                                                                })
                                                            ) : (
                                                                `${selectedMembers.length} members selected`
                                                            )
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-sm max-w-60 overflow-y-auto" align="start">
                                                    <div className="flex flex-col gap-2">
                                                        {workspaceMembers.map((member) => {
                                                            const selectedMember = selectedMembers.find(m => m.user === member.user._id);
                                                            return (
                                                                <div key={member._id} className="flex items-center gap-2 p-2 border rounded">
                                                                    <Checkbox
                                                                        checked={!!selectedMember}
                                                                        onCheckedChange={(checked) => {
                                                                            if (checked) {
                                                                                field.onChange([...selectedMembers, { user: member.user._id, role: "Contributor" }]);
                                                                            }
                                                                            else {
                                                                                field.onChange(selectedMembers.filter(m => m.user !== member.user._id));
                                                                            }
                                                                        }}
                                                                        id={`member-${member.user._id}`}
                                                                    />
                                                                    <span className="truncate flex-1">
                                                                        {member.user.name}
                                                                    </span>
                                                                    {selectedMember && (
                                                                        <Select
                                                                            value={selectedMember.role}
                                                                            onValueChange={(role) => {
                                                                                field.onChange(selectedMembers.map((m) => m.user === member.user._id ?
                                                                                    { ...m, role: role as "Contributor" | "Manager" | "Viewer" }
                                                                                    :
                                                                                    m))
                                                                            }}
                                                                        >
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder="Select Role" />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem value="Manager">Manager</SelectItem>
                                                                                <SelectItem value="Contributor">Contributor</SelectItem>
                                                                                <SelectItem value="Viewer">Viewer</SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    )}
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
                            }
                            }
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Creating..." : "Create Project"}
                            </Button>
                        </DialogFooter>
                    </form>

                </DialogContent>
            </Dialog>
        </div >
    );
}