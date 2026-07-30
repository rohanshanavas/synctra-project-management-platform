import { NoDataFound } from '@/components/no-data-found';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import { CreateWorkSpace } from '@/components/workspace/create-workspace';
import { WorkspaceAvatar } from '@/components/workspace/workspace-avatar';
import { useGetWorkspacesQuery } from '@/hooks/useWorkspace';
import type { WorkSpace } from '@/types';
import { PlusCircle, Users } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router';
import { format } from 'date-fns';

const Workspaces = () => {

    const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
    const { data: workspaces, isLoading } = useGetWorkspacesQuery() as { data: WorkSpace[], isLoading: boolean };

    if (isLoading) {
        return <Loader />
    }

    return (
        <>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl md:text-3xl font-bold">Workspaces</h2>
                    <Button onClick={() => setIsCreatingWorkspace(true)}>
                        <PlusCircle className="mr-2 size-4" />
                        New Workspace
                    </Button>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 grid-cols-2 lg:grid-cols-3">
                    {
                        workspaces.map((workspace) => (
                            <WorkspaceCard key={workspace._id} workspace={workspace} />
                        ))
                    }

                    {
                        workspaces.length === 0 && (
                            <NoDataFound
                                title="No Workspaces Found"
                                description="Create a new workspace to get started"
                                buttonText="Create Workspace"
                                buttonAction={() => setIsCreatingWorkspace(true)}
                            />
                        )
                    }
                </div>
            </div>
            <CreateWorkSpace isCreatingWorkSpace={isCreatingWorkspace} setIsCreatingWorkSpace={setIsCreatingWorkspace} />
        </>
    );
}

const WorkspaceCard = ({ workspace }: { workspace: WorkSpace }) => {
    return (
        <Link to={`/workspaces/${workspace._id}`}>
            <Card className="hover:shadow-md transition-all hover:-translate-y-1">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                            <WorkspaceAvatar name={workspace.name} color={workspace.color} />
                            <div>
                                <CardTitle>{workspace.name} </CardTitle>
                                <span className="text-sm text-muted-foreground">
                                    Created at {format(workspace.createdAt, "MMM d, yyyy h:mm a")}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center text-muted-foreground">
                            <Users className="size-4 mr-1" />
                            <span className="text-xs">
                                {workspace.members.length} {workspace.members.length === 1 ? 'Member' : 'Members'}
                            </span>
                        </div>
                    </div>

                    <CardDescription>
                        {workspace.description || "No description provided"}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="text-sm text-muted-foreground">
                        View workspace details and projects
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};

export default Workspaces;