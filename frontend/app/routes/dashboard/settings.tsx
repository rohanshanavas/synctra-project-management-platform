
import { colorOptions, type WorkspaceForm } from "@/components/workspace/create-workspace";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDeleteWorkspaceMutation, useGetWorkspaceMembersQuery, useTransferWorkspaceOwnershipMutation, useUpdateWorkspaceMutation } from "@/hooks/useWorkspace";
import { cn } from "@/lib/utils";
import { useAuth } from "@/provider/authContext";
import { queryClient } from "@/provider/reactQueryProvider";
import type { WorkSpace } from "@/types";
import { Settings as SettingsIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useRevalidator, useSearchParams } from "react-router";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { workspaceSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";

const Settings = () => {
    const [searchParams] = useSearchParams();
    const workspaceId = searchParams.get("workspaceId") || "";
    const hasWorkspaceSelected = Boolean(workspaceId);
    const { user } = useAuth();
    const navigate = useNavigate();
    const { revalidate } = useRevalidator();

    const form = useForm<WorkspaceForm>({
        resolver: zodResolver(workspaceSchema),
        defaultValues: {
            name: "",
            description: "",
            color: colorOptions[0]
        }
    });

    const { data, isPending } = useGetWorkspaceMembersQuery(workspaceId) as {
        data: WorkSpace;
        isPending: boolean;
    };

    const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } = useUpdateWorkspaceMutation();
    const { mutate: transferWorkspace, isPending: isTransferringWorkspace } = useTransferWorkspaceOwnershipMutation();
    const { mutate: removeWorkspace, isPending: isDeletingWorkspace } = useDeleteWorkspaceMutation();

    const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedNewOwnerId, setSelectedNewOwnerId] = useState("");

    useEffect(() => {
        if (!data) {
            return;
        }

        form.reset({
            name: data.name || "",
            description: data.description || "",
            color: data.color || colorOptions[0],
        });
    }, [data, form]);

    if (!hasWorkspaceSelected) {
        return (
            <div className="flex h-full items-center justify-center rounded-xl border border-dashed p-8 text-center">
                <div>
                    <h2 className="text-xl font-semibold">No workspace selected</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Select a workspace from the header to manage settings
                    </p>
                </div>
            </div>
        );
    }

    if (isPending) {
        return <Loader />;
    }

    if (!data) {
        return <Loader />;
    }

    const ownerId = data.owner;
    const isOwner = Boolean(ownerId && user?._id === ownerId);
    const transferCandidates = data.members.filter((member) => member.user._id !== ownerId);

    const handleSaveChanges = (data: WorkspaceForm) => {

        if (!isOwner) {
            toast.error("Only workspace owner can update settings");
            return;
        }

        if (!form.formState.isDirty) {
            toast.info("No changes were made");
            return;
        }

        updateWorkspace(
            { workspaceId, data },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "details"] });
                    queryClient.invalidateQueries({ queryKey: ["workspaces"] });
                    revalidate();
                    toast.success("Workspace settings updated successfully");
                },
                onError: (error: any) => {
                    const errorMessage = error.response?.data?.message || "Failed to update workspace settings";
                    toast.error(errorMessage);
                }
            }
        );
    };

    const handleTransferWorkspace = () => {
        if (!selectedNewOwnerId) {
            toast.error("Please select a member to transfer ownership");
            return;
        }

        transferWorkspace(
            { workspaceId, newOwnerId: selectedNewOwnerId },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "details"] });
                    queryClient.invalidateQueries({ queryKey: ["workspaces"] });
                    revalidate();
                    setSelectedNewOwnerId("");
                    setIsTransferDialogOpen(false);
                    toast.success("Workspace ownership transferred successfully");
                },
                onError: (error: any) => {
                    const errorMessage = error.response?.data?.message || "Failed to transfer workspace";
                    toast.error(errorMessage);
                }
            }
        );
    };

    const handleDeleteWorkspace = () => {
        removeWorkspace(
            { workspaceId },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["workspaces"] });
                    setIsDeleteDialogOpen(false);
                    toast.success("Workspace deleted successfully");
                    navigate("/dashboard", { replace: true });
                    revalidate();
                },
                onError: (error: any) => {
                    const errorMessage = error.response?.data?.message || "Failed to delete workspace";
                    toast.error(errorMessage);
                }
            }
        );
    };

    return (
        <div className="mx-auto max-w-3xl space-y-4 pb-4 md:space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <SettingsIcon className="size-4 text-muted-foreground" />
                        <CardTitle>Workspace Settings</CardTitle>
                    </div>
                    <CardDescription>
                        Manage your workspace settings and preferences
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={form.handleSubmit(handleSaveChanges)} className="space-y-4">
                        <div className="space-y-4 py-4">
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Workspace Name</FieldLabel>
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
                        <div className="flex justify-end pt-1">
                            <Button type="submit" disabled={!isOwner || isUpdatingWorkspace}>
                                {isUpdatingWorkspace ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                    {!isOwner && (
                        <p className="mt-3 text-xs text-muted-foreground">
                            Only the workspace owner can update settings.
                        </p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Transfer Workspace</CardTitle>
                    <CardDescription>
                        Transfer ownership of this workspace to another member
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        type="button"
                        variant="secondary"
                        disabled={!isOwner || transferCandidates.length === 0 || isTransferringWorkspace}
                        onClick={() => setIsTransferDialogOpen(true)}
                    >
                        Transfer Workspace
                    </Button>
                    {!isOwner && (
                        <p className="mt-3 text-xs text-muted-foreground">
                            Only the workspace owner can transfer ownership.
                        </p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-red-600">Danger Zone</CardTitle>
                    <CardDescription>Irreversible actions for your workspace</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        type="button"
                        disabled={!isOwner || isDeletingWorkspace}
                        className="bg-red-500 text-white hover:bg-red-600"
                        onClick={() => setIsDeleteDialogOpen(true)}
                    >
                        Delete Workspace
                    </Button>
                    {!isOwner && (
                        <p className="mt-3 text-xs text-muted-foreground">
                            Only the workspace owner can delete this workspace.
                        </p>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Transfer Workspace Ownership</DialogTitle>
                        <DialogDescription>
                            Select a member who will become the new workspace owner.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">New Owner</label>
                        <Select value={selectedNewOwnerId} onValueChange={(value) => setSelectedNewOwnerId(value || "")}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select workspace member" />
                            </SelectTrigger>
                            <SelectContent>
                                {transferCandidates.map((member) => (
                                    <SelectItem key={member.user._id} value={member.user._id}>
                                        {member.user.name} ({member.user.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button disabled={!selectedNewOwnerId || isTransferringWorkspace} onClick={handleTransferWorkspace}>
                            {isTransferringWorkspace ? "Transferring..." : "Confirm Transfer"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Workspace</DialogTitle>
                        <DialogDescription>
                            This action is permanent. All projects and tasks in this workspace will be deleted.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            className="bg-red-500 text-white hover:bg-red-600"
                            disabled={isDeletingWorkspace}
                            onClick={handleDeleteWorkspace}
                        >
                            {isDeletingWorkspace ? "Deleting..." : "Delete Workspace"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Settings;