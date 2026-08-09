import { BackButton } from "@/components/back-button";
import { SubTaskDetails } from "@/components/task/subtask-details";
import { TaskAssigneesSelector } from "@/components/task/task-assignees-selector";
import { TaskDescription } from "@/components/task/task-description";
import { TaskPrioritySelector } from "@/components/task/task-priority-selector";
import { TaskStatusSelector } from "@/components/task/task-status-selector";
import { TaskTitle } from "@/components/task/task-title";
import { Watchers } from "@/components/task/watchers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useArchiveTaskMutation, useTaskbyIdQuery, useWatchTaskMutation } from "@/hooks/useTask";
import { useAuth } from "@/provider/authContext";
import type { Project, Task } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { TaskActivity } from "../../../components/task/task-activity";
import { CommentSection } from "@/components/task/comment-section";
import { toast } from "sonner";

const TaskDetails = () => {

    const { user } = useAuth();
    const { taskId, projectId, workspaceId } = useParams<{ taskId: string; projectId: string; workspaceId: string }>();
    const navigate = useNavigate();

    const { data, isLoading } = useTaskbyIdQuery(taskId!) as {
        data: { task: Task; project: Project },
        isLoading: boolean
    };

    const { mutate: watchTask, isPending: isWatching } = useWatchTaskMutation();
    const { mutate: archiveTask, isPending: isArchived } = useArchiveTaskMutation();

    if (isLoading) {
        return (
            <Loader />
        )
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-2xl font-bold">
                    Task Not Found
                </div>
            </div>
        )
    }

    const { task, project } = data;

    const isUserWatching = task?.watchers?.some((watcher) => watcher._id.toString() === user?._id.toString());

    const goBack = () => {
        navigate(-1);
    }

    const members = task?.assignees || [];

    const handleWatchTask = () => {
        watchTask({ taskId: task._id }, {
            onSuccess: () => {
                toast.success(isUserWatching ? "You are no longer watching this task" : "You are now watching this task");
            },
            onError: (error: any) => {
                const errorMessage = error?.response?.data?.message;
                toast.error(errorMessage);
                console.log("Error watching task:", errorMessage);
            }
        });
    }

    const handleArchiveTask = () => {
        archiveTask({ taskId: task._id }, {
            onSuccess: () => {
                toast.success(task.isArchived ? "Task unarchived successfully" : "Task archived successfully");
            },
            onError: (error: any) => {
                const errorMessage = error?.response?.data?.message;
                toast.error(errorMessage);
                console.log("Error archiving task:", errorMessage);
            }
        });
    }

    return (
        <div className="container mx-auto p-0 py-4 md:px-4">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                <div className="flex flex-col md:flex-row md:items-center">
                    <BackButton />
                    <h1 className="text-xl md:text-2xl font-bold">{task.title}</h1>
                    {task.isArchived && (
                        <Badge className="ml-2" variant="outline">
                            Archived
                        </Badge>
                    )}
                </div>

                <div className="flex space-x-2 mt-4 md:mt-0">
                    <Button className="w-fit" variant="outline" size="sm" onClick={handleWatchTask} disabled={isWatching}>
                        {isUserWatching ? (
                            <>
                                <EyeOff className="mr-2 size-4" />
                                Unwatch
                            </>
                        ) : (
                            <>
                                <Eye className="mr-2 size-4" />
                                Watch
                            </>
                        )}
                    </Button>

                    <Button className="w-fit" variant="outline" size="sm" onClick={handleArchiveTask} disabled={isArchived}>
                        {task.isArchived ? "Unarchive" : "Archive"}
                    </Button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-card shadow-sm rounded-lg p-6 mb-6">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                            <div>
                                <Badge className="capitalize mb-2"
                                    variant={task.priority === "High" ? "destructive" : task.priority === "Medium" ? "default" : "outline"}>
                                    {task.priority} Priority
                                </Badge>

                                <TaskTitle title={task.title} taskId={task._id} />

                                <div className="text-sm md:text-base text-muted-foreground">
                                    Created at {" "}
                                    {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-4 md:mt-0">
                                <TaskStatusSelector status={task.status} taskId={task._id} />
                                <Button className="hidden md:block" variant="destructive" size="sm" onClick={() => { }}>
                                    Delete Task
                                </Button>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-muted-foreground mb-0">
                                Description:
                            </h3>
                            <TaskDescription description={task.description || ""} taskId={task._id} />
                        </div>

                        <TaskAssigneesSelector task={task} assignees={task.assignees} projectMembers={project.members as any} />

                        <TaskPrioritySelector priority={task.priority} taskId={task._id} />

                        <SubTaskDetails taskId={task._id} subtasks={task.subtasks || []} />
                    </div>

                    <CommentSection taskId={task._id} members={project.members as any} />
                </div>

                <div className="w-full">
                    <Watchers watchers={task.watchers || []} />

                    <TaskActivity resourceId={task._id} />
                </div>
            </div>
        </div >
    )

}

export default TaskDetails;