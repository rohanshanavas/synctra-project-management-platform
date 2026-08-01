import type { User, WorkSpace } from "@/types";
import { WorkspaceAvatar } from "./workspace-avatar";
import { Button } from "../ui/button";
import { Plus, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface WorkspaceHeaderProps {
    workspace: WorkSpace;
    members: {
        _id: string;
        user: User;
        role: "admin" | "member" | "viewer" | "owner";
        joinedAt: Date;
    }[];
    onCreateProject: () => void;
    onInviteMember: () => void;
}

export const WorkspaceHeader = (
    { workspace, members, onCreateProject, onInviteMember }: WorkspaceHeaderProps) => {

    return (
        <div className="space-y-8">
            <div className="space-y-3">
                <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex md:items-center gap-3">
                        {workspace.color && (
                            <WorkspaceAvatar
                                color={workspace.color}
                                name={workspace.name}
                            />
                        )}
                        <h2 className="text-xl md:text-2xl font-semibold">{workspace.name}</h2>
                    </div>
                    <div className="flex items-center gap-3 justify-between md:justify-start mb-4 md:mb-0">
                        <Button onClick={onInviteMember} variant="outline">
                            <UserPlus className="mr-2 size-4" />
                            Invite
                        </Button>
                        <Button onClick={onCreateProject}>
                            <Plus className="mr-2 size-4" />
                            Create Project
                        </Button>
                    </div>
                </div>
                {workspace.description && (
                    <p className="text-sm md:text-base text-muted-foreground">{workspace.description}</p>
                )}
            </div>

            {members.length > 0 && (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        Members
                    </span>
                    <div className="flex space-x-2">
                        {members.map((member) => (
                            <Avatar key={member._id} className="relative w-8 h-8 rounded-full border-2 border-background overflow-hidden" title={member.user.name}>
                                <AvatarImage src={member.user.profilePicture} alt={member.user.name}/>
                                <AvatarFallback>{member.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};