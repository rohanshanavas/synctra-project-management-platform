import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/ui/loader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetArchivedItemsQuery } from "@/hooks/useWorkspace";
import type { Project, Task } from "@/types";
import { format } from "date-fns";
import { Link, useSearchParams } from "react-router";

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    "In Progress": "default",
    "Planning": "secondary",
    "Completed": "outline",
    "On Hold": "secondary",
    "Cancelled": "destructive"
};

const priorityVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    "High": "destructive",
    "Medium": "default",
    "Low": "secondary",
};

const Archived = () => {
    const [searchParams] = useSearchParams();
    const workspaceId = searchParams.get("workspaceId");
    const hasWorkspaceSelected = Boolean(workspaceId);

    const { data, isPending } = useGetArchivedItemsQuery(workspaceId || "") as {
        data: { archivedProjects: Project[]; archivedTasks: Task[] };
        isPending: boolean;
    };

    if (!hasWorkspaceSelected) {
        return (
            <div className="flex h-full items-center justify-center rounded-xl border border-dashed p-8 text-center">
                <div>
                    <h2 className="text-xl font-semibold">No workspace selected</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Select a workspace from the header to view archived projects and tasks
                    </p>
                </div>
            </div>
        );
    }

    if (isPending) {
        return <Loader />;
    }

    const archivedProjects = data?.archivedProjects ?? [];
    const archivedTasks = data?.archivedTasks ?? [];

    return (
        <div className="space-y-10 pb-4">
            <div>
                <h2 className="text-xl font-bold mb-4">Archived Projects</h2>
                {archivedProjects.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">No archived projects found</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Progress</TableHead>
                                <TableHead>Updated At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {archivedProjects.map((project) => (
                                <TableRow key={project._id}>
                                    <TableCell>
                                        <Link
                                            to={`/workspaces/${workspaceId}/projects/${project._id}`}
                                            className="hover:underline"
                                        >
                                            <div className="font-medium">{project.title}</div>
                                        </Link>
                                        <div className="text-xs text-muted-foreground">Project</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariant[project.status] ?? "secondary"}>
                                            {project.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{project.progress}%</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {project.updatedAt ? format(new Date(project.updatedAt), "MMM d, yyyy") : "—"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4">Archived Tasks</h2>
                {archivedTasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">No archived tasks found</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Project</TableHead>
                                <TableHead>Updated At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {archivedTasks.map((task) => (
                                <TableRow key={task._id}>
                                    <TableCell>
                                        <Link
                                            to={`/workspaces/${workspaceId}/projects/${task.project}/tasks/${task._id}`}
                                            className="hover:underline"
                                        >
                                            <div className="font-medium">{task.title}</div>
                                        </Link>
                                        <div className="text-xs text-muted-foreground">Task</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariant[task.status] ?? "secondary"}>
                                            {task.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={priorityVariant[task.priority] ?? "secondary"}>
                                            {task.priority}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {typeof task.project === "object" ? task.project.title : "—"}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {task.updatedAt ? format(new Date(task.updatedAt), "MMM d, yyyy") : "—"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
};

export default Archived;