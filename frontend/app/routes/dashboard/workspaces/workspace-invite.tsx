import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { WorkspaceAvatar } from "@/components/workspace/workspace-avatar";
import { useAcceptInviteByTokenMutation, useAcceptInviteMutation, useGetWorkspaceDetailsQuery } from "@/hooks/useWorkspace";
import type { WorkSpace } from "@/types";
import { useNavigate, useParams, useSearchParams } from "react-router"
import { toast } from "sonner";

const WorkspaceInvite = () => {

    const { workspaceId } = useParams();

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const navigate = useNavigate();

    if (!workspaceId) {
        return (
            <div>
                No workspace found
            </div>
        );
    }

    const { data: workspace, isLoading } = useGetWorkspaceDetailsQuery(workspaceId!) as {
        data: WorkSpace;
        isLoading: boolean;
    };

    const { mutate: acceptInvite, isPending: isAcceptingPending } = useAcceptInviteMutation();

    const { mutate: acceptInviteByToken, isPending: isAcceptingByTokenPending } = useAcceptInviteByTokenMutation();

    const handleAcceptInvite = () => {

        if (!workspaceId) {
            return;
        }

        if (token) {
            acceptInviteByToken(token, {
                onSuccess: () => {
                    toast.success("Invitation accepted successfully");
                    navigate(`/workspaces/${workspaceId}`);
                },
                onError: (error: any) => {
                    const errorMessage = error?.response?.data?.message || "Failed to accept invitation";
                    toast.error(errorMessage);
                    console.log("Error accepting invitation:", error);
                }
            });
        } 
        else {
            acceptInvite(workspaceId, {
                onSuccess: () => {
                    toast.success("Invitation accepted successfully");
                    navigate(`/workspaces/${workspaceId}`);
                },
                onError: (error: any) => {
                    const errorMessage = error?.response?.data?.message || "Failed to accept invitation";
                    toast.error(errorMessage);
                    console.log("Error accepting invitation:", error);
                }
            });
        }
    };

    const handleDeclineInvite = () => {
        toast.info("You have declined the invitation");
        navigate("/workspaces");
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center w-full h-screen">
                <Loader />
            </div>
        );
    }

    if (!workspace) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle>Invalid Invitation</CardTitle>
                        <CardDescription>
                            This workspace invitation is invalid or has expired
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Button onClick={() => navigate("/workspaces")} className="w-full">
                            Go to Workspaces
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <Card className="max-w-md w-full">
                <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <WorkspaceAvatar name={workspace.name} color={workspace.color} />
                        <CardTitle>{workspace.name}</CardTitle>
                    </div>
                    <CardDescription>
                        You have been invited to join the workspace: "<strong>{workspace.name}</strong>"
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {workspace.description && (
                        <p className="text-sm text-muted-foreground">
                            {workspace.description}
                        </p>
                    )}
                    <div className="flex gap-3">
                        <Button variant="default" className="flex-1" onClick={handleAcceptInvite} disabled={isAcceptingPending || isAcceptingByTokenPending}>
                            {isAcceptingPending || isAcceptingByTokenPending ? "Joining..." : "Accept Invite"}
                        </Button>
                        <Button variant="outline" className="flex-1" onClick={handleDeclineInvite} disabled={isAcceptingPending || isAcceptingByTokenPending}>
                            Decline
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default WorkspaceInvite