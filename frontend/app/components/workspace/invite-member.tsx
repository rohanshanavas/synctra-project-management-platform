import { inviteMemberSchema } from "@/lib/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useState } from "react";
import { Field, FieldContent, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Check, Copy, Mail } from "lucide-react";
import { useInviteMemberMutation } from "@/hooks/useWorkspace";
import { toast } from "sonner";

interface InviteMemberDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    workspaceId: string;
}

export type InviteMemberFormData = z.infer<typeof inviteMemberSchema>;

const ROLES = ["admin", "member", "viewer"] as const;

export const InviteMemberDialog = ({ isOpen, onOpenChange, workspaceId }: InviteMemberDialogProps) => {

    const [inviteTab, setInviteTab] = useState<"email" | "link">("email");
    const [linkCopied, setLinkCopied] = useState(false);

    const form = useForm<InviteMemberFormData>({
        resolver: zodResolver(inviteMemberSchema),
        defaultValues: {
            email: "",
            role: "member"
        },
    });

    const { mutate, isPending } = useInviteMemberMutation();


    const onSubmit = async (data: InviteMemberFormData) => {

        if (!workspaceId) {
            console.error("Workspace ID is not available");
            return;
        }

        mutate({ ...data, workspaceId }, {
            onSuccess: () => {
                toast.success("Invitation sent successfully");
                form.reset();
                setInviteTab("email");
                onOpenChange(false);
            },
            onError: (error: any) => {
                const errorMessage = error?.response?.data?.message || "An error occurred while inviting the member.";
                toast.error(errorMessage);
                console.error("Error inviting member:", error);
            }
        });
    }

    const handleCopyInviteLink = () => {

        const inviteLink = `${window.location.origin}/workspace-invite/${workspaceId}`;
        navigator.clipboard.writeText(inviteLink);

        setLinkCopied(true);

        setTimeout(() => {
            setLinkCopied(false);
        }, 3000);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite to Workspace</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="email" value={inviteTab} onValueChange={setInviteTab}>
                    <TabsList>
                        <TabsTrigger value="email" disabled={isPending}>Invite by Email</TabsTrigger>
                        <TabsTrigger value="link" disabled={isPending}>Share Link</TabsTrigger>
                    </TabsList>

                    <TabsContent value="email">
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <div className="flex flex-col space-y-6 w-full">
                                        <Controller
                                            name="email"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field>
                                                    <FieldLabel>Email Address</FieldLabel>
                                                    <FieldContent>
                                                        <Input
                                                            placeholder="Enter email..."
                                                            {...field}
                                                        />
                                                    </FieldContent>
                                                    <FieldError errors={[fieldState.error]} />
                                                </Field>
                                            )}
                                        />
                                        <Controller
                                            name="role"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field>
                                                    <FieldLabel>Select Role</FieldLabel>
                                                    <FieldContent>
                                                        <div className="ml-1 flex gap-3 flex-wrap">
                                                            {ROLES.map((role) => (
                                                                <Label key={role} className="flex items-center cursor-pointer gap-2">
                                                                    <Input
                                                                        type="radio"
                                                                        value={role}
                                                                        className="hidden"
                                                                        checked={field.value === role}
                                                                        onChange={() => field.onChange(role)}
                                                                    />
                                                                    <span className={cn(
                                                                        "bg-blue-900 w-4 h-4 rounded-full border-2 border-blue-300 flex items-center justify-center transition-all duration-300 hover:shadow-lg",
                                                                        field.value === role && "ring-2 ring-blue-500 ring-offset-2"
                                                                    )}>
                                                                        {field.value === role && (
                                                                            <span className="w-2 h-2 bg-white rounded-full" />
                                                                        )}

                                                                    </span>
                                                                    <span className="capitalize">
                                                                        {role}
                                                                    </span>
                                                                </Label>
                                                            ))}
                                                        </div>
                                                    </FieldContent>
                                                    <FieldError errors={[fieldState.error]} />
                                                </Field>
                                            )}
                                        />
                                    </div>

                                    <Button className="mt-6 w-full" size="lg" disabled={isPending} type="submit">
                                        <Mail className="mr-2 h-4 w-4" />
                                        Send Invite
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="link">
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label>Share this link to invite people</Label>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        value={`${window.location.origin}/workspace-invite/${workspaceId}`}
                                        readOnly
                                    />
                                    <Button onClick={handleCopyInviteLink} disabled={isPending}>
                                        {linkCopied ? (
                                            <>
                                                <Check className="mr-2 h-4 w-4" />
                                                Copied
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="mr-2 h-4 w-4" />
                                                Copy
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Anyone with the link can join this workspace
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}