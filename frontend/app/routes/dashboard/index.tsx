import { StatisticsCharts } from "@/components/dashboard/statistics-charts";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Loader } from "@/components/ui/loader";
import { useGetWorkspaceStatsQuery } from "@/hooks/useWorkspace";
import type { Project, ProjectStatusData, StatsCardProps, Task, TaskPriorityData, TaskTrendsData, WorkspaceProductivityData } from "@/types";
import { useSearchParams } from "react-router";

const Dashboard = () => {

    const [searchParams] = useSearchParams();
    const workspaceId = searchParams.get("workspaceId");
    const hasWorkspaceSelected = Boolean(workspaceId);

    const { data, isPending } = useGetWorkspaceStatsQuery(workspaceId || "") as {
        data: {
            stats: StatsCardProps;
            taskTrendsData: TaskTrendsData[];
            projectStatusData: ProjectStatusData[];
            taskPriorityData: TaskPriorityData[];
            workspaceProductivityData: WorkspaceProductivityData[];
            upcomingTasks: Task[];
            recentProjects: Project[];
        },
        isPending: boolean
    };

    if (!hasWorkspaceSelected) {
        return (
            <div className="flex h-full items-center justify-center rounded-xl border border-dashed p-8 text-center">
                <div>
                    <h2 className="text-xl font-semibold">No workspace selected</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Select a workspace from the header to view the dashboard
                    </p>
                </div>
            </div>
        );
    }

    if (isPending) {
        return (
            <div>
                <Loader />
            </div>
        );
    }

    return (
        <div className="space-y-8 2xl:space-y-12 pb-2">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>

            <StatsCard data={data.stats} />

            <StatisticsCharts
                stats={data.stats}
                taskTrendsData={data.taskTrendsData}
                projectStatusData={data.projectStatusData}
                taskPriorityData={data.taskPriorityData}
                workspaceProductivityData={data.workspaceProductivityData}
            />
        </div>
    )
}

export default Dashboard;