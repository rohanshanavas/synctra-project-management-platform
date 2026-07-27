import { useAuth } from "@/provider/authContext";
import type { WorkSpace } from "@/types";
import { Button } from "../ui/button";
import { Bell, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link } from "react-router";
import { WorkspaceAvatar } from "../workspace/workspace-avatar";

interface HeaderProps {
    onWorkSpaceSelected: (workspace: WorkSpace) => void;
    selectedWorkSpace: WorkSpace | null;
    onCreateWorkSpace: () => void;
}


export const Header = ({ onWorkSpaceSelected, selectedWorkSpace, onCreateWorkSpace }: HeaderProps) => {

    const { user, logout } = useAuth();
    const workspaces = [];

    return (
        <div className="bg-background sticky top-0 z-40 border-b">
            <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8 py-4">

                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="outline">
                            {selectedWorkSpace ? (
                                <>
                                    {selectedWorkSpace.color && (<WorkspaceAvatar color={selectedWorkSpace.color} name={selectedWorkSpace.name} />)}
                                    <span className="font-medium">{selectedWorkSpace?.name}</span>
                                </>
                            ) : (
                                <span className="font-medium">Select Workspace</span>
                            )}
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-max">
                        <DropdownMenuLabel className="font-bold">Workspace</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            {
                                workspaces.map((workspace) => (
                                    <DropdownMenuItem key={workspace.id} onClick={() => onWorkSpaceSelected(workspace)}>
                                        {workspace.color && <WorkspaceAvatar color={workspace.color} name={workspace.name} />}
                                        <span className="ml-2">{workspace.name}</span>
                                    </DropdownMenuItem>
                                ))
                            }
                        </DropdownMenuGroup>

                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={onCreateWorkSpace}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create Workspace
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                        <Bell />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <button className="rounded-full border w-8 h-8">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user?.profilePicture} alt={user?.name} />
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel className="font-bold"> My Account </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Link to="/user/profile"> Profile </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logout}>
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

            </div>
        </div>
    );
};