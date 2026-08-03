import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { workspaceSchema } from '@/lib/schema';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Field, FieldContent, FieldError, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { useCreateWorkSpace } from '@/hooks/useWorkspace';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

interface CreateWorkSpaceProps {
    isCreatingWorkSpace: boolean;
    setIsCreatingWorkSpace: (isCreatingWorkSpace: boolean) => void;
}

export const colorOptions = [
    "#FF5733", // Red-Orange
    "#33C1FF", // Blue
    "#28A745", // Green
    "#FFC300", // Yellow
    "#8E44AD", // Purple
    "#E67E22", // Orange
    "#2ECC71", // Light Green
    "#34495E", // Navy
];

export type WorkspaceForm = z.infer<typeof workspaceSchema>;

export const CreateWorkSpace = ({ isCreatingWorkSpace, setIsCreatingWorkSpace }: CreateWorkSpaceProps) => {

    const form = useForm<WorkspaceForm>({
        resolver: zodResolver(workspaceSchema),
        defaultValues: {
            name: "",
            description: "",
            color: colorOptions[0]
        }
    });

    const navigate = useNavigate();

    const { mutate, isPending } = useCreateWorkSpace();

    const onSubmit = (data: WorkspaceForm) => {
        mutate(data, {
            onSuccess: (data: any) => {
                form.reset();
                setIsCreatingWorkSpace(false);
                toast.success("Workspace created successfully!");
                navigate(`/workspaces/${data._id}`);
            },
            onError: (error: any) => {
                const errorMessage = error.response?.data?.message || "An error occurred while creating the workspace.";
                console.log("Error creating workspace:", errorMessage);
                toast.error(errorMessage);
            }
        });
    };

    return (
        <div>
            <Dialog open={isCreatingWorkSpace} onOpenChange={setIsCreatingWorkSpace} modal={true}>
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create Workspace</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-4 py-4">
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Name</FieldLabel>
                                        <FieldContent>
                                            <Input
                                                placeholder="Workspace Name"
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
                                                placeholder="Workspace Description"
                                                rows={3}
                                                {...field}
                                            />
                                        </FieldContent>
                                        <FieldError errors={[fieldState.error]} />
                                    </Field>
                                )}
                            />
                            <Controller
                                name="color"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Color</FieldLabel>
                                        <FieldContent>
                                            <div className="flex gap-3 flex-wrap">
                                                {colorOptions.map((color) => (
                                                    <div
                                                        key={color}
                                                        className={cn(
                                                            "w-6 h-6 rounded-full cursor-pointer hover:opacity-80 transition-all duration-300",
                                                            field.value === color && "ring-2 ring-offset-2 ring-blue-500"
                                                        )}
                                                        style={{ backgroundColor: color }}
                                                        onClick={() => field.onChange(color)}
                                                    />
                                                ))}
                                            </div>
                                        </FieldContent>
                                        <FieldError errors={[fieldState.error]} />
                                    </Field>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Creating..." : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )

}