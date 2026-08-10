import type { ProjectStatusData, StatsCardProps, TaskPriorityData, TaskTrendsData, WorkspaceProductivityData } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Car, ChartBarBig, ChartLine, ChartPie } from "lucide-react";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, Sector, XAxis, YAxis } from "recharts";

export const StatisticsCharts = ({ stats, taskTrendsData, projectStatusData, taskPriorityData, workspaceProductivityData }: {
    stats: StatsCardProps;
    taskTrendsData: TaskTrendsData[];
    projectStatusData: ProjectStatusData[];
    taskPriorityData: TaskPriorityData[];
    workspaceProductivityData: WorkspaceProductivityData[];
}) => {

    return (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-0.5">
                        <CardTitle className="text-base font-medium">Task Trends</CardTitle>
                        <CardDescription>
                            Daily Task Status Changes
                        </CardDescription>
                    </div>
                    <ChartLine className="size-5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="w-full overflow-x-auto">
                    <div className="min-w-87.5">
                        <ChartContainer className="mx-auto h-75 w-full" config={{
                            completed: { label: "Completed", color: "#10b981" },
                            inProgress: { label: "In Progress", color: "#f59e0b" },
                            toDo: { label: "To Do", color: "#3b82f6" }
                        }}>
                            <LineChart data={taskTrendsData}>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />

                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <ChartTooltip content={<ChartTooltipContent />} />

                                <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="inProgress" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="toDo" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />

                                <ChartLegend content={<ChartLegendContent />}
                                />
                            </LineChart>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-0.5">
                        <CardTitle className="text-base font-medium">Project Status</CardTitle>
                        <CardDescription>
                            Project Status Breakdown
                        </CardDescription>
                    </div>
                    <ChartPie className="size-5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="w-full overflow-x-auto">
                    <div className="min-w-70">
                        <ChartContainer className="mx-auto h-75 w-full" config={{
                            "Completed": { color: "#10b981" },
                            "In Progress": { color: "#f59e0b" },
                            "Planning": { color: "#3b82f6" }
                        }}>
                            <PieChart>
                                <Pie data={projectStatusData} cx="50%" cy="50%" nameKey="name" dataKey="value"
                                    innerRadius={60} outerRadius={80} paddingAngle={2}
                                    label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
                                    labelLine={false}
                                    shape={(props) => (
                                        <Sector
                                            {...props}
                                            fill={props.payload.color}
                                        />
                                    )}
                                />
                                <ChartTooltip />
                                <ChartLegend
                                    content={() => (
                                        <div className="flex items-center justify-center gap-6">
                                            {projectStatusData.map((entry) => (
                                                <div
                                                    key={entry.name}
                                                    className="flex items-center gap-2"
                                                >
                                                    <div
                                                        className="h-3 w-3 rounded-sm"
                                                        style={{
                                                            backgroundColor: entry.color,
                                                        }}
                                                    />

                                                    <span className="text-sm text-muted-foreground">
                                                        {entry.name}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                />
                            </PieChart>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-0.5">
                        <CardTitle className="text-base font-medium">Task Priority</CardTitle>
                        <CardDescription>
                            Task Priority Breakdown
                        </CardDescription>
                    </div>
                    <ChartPie className="size-5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="w-full overflow-x-auto">
                    <div className="min-w-70">
                        <ChartContainer className="mx-auto h-75 w-full" config={{
                            High: { color: "#ef4444" },
                            Medium: { color: "#f59e0b" },
                            Low: { color: "#6b7280" }
                        }}>
                            <PieChart>
                                <Pie data={taskPriorityData} cx="50%" cy="50%" nameKey="name" dataKey="value"
                                    innerRadius={60} outerRadius={80} paddingAngle={2}
                                    label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
                                    labelLine={false}
                                    shape={(props) => (
                                        <Sector
                                            {...props}
                                            fill={props.payload.color}
                                        />
                                    )}
                                />
                                <ChartTooltip />
                                <ChartLegend
                                    content={() => (
                                        <div className="flex items-center justify-center gap-6">
                                            {taskPriorityData.map((entry) => (
                                                <div
                                                    key={entry.name}
                                                    className="flex items-center gap-2"
                                                >
                                                    <div
                                                        className="h-3 w-3 rounded-sm"
                                                        style={{
                                                            backgroundColor: entry.color,
                                                        }}
                                                    />

                                                    <span className="text-sm text-muted-foreground">
                                                        {entry.name}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                />
                            </PieChart>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-0.5">
                        <CardTitle className="text-base font-medium">Workspace Productivity</CardTitle>
                        <CardDescription>
                            Task Completion by Project
                        </CardDescription>
                    </div>
                    <ChartBarBig className="size-5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="w-full overflow-x-auto">
                    <div className="min-w-87.5">
                        <ChartContainer className="mx-auto h-75 w-full" config={{
                            completed: { label: "Completed Tasks", color: "#3b82f6" },
                            total: { label: "Total Tasks", color: "red" }
                        }}>
                            <BarChart data={workspaceProductivityData} barGap={0} barSize={20}>
                                <XAxis
                                    dataKey="name"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    interval={0}
                                    minTickGap={0}
                                    height={56}
                                    tick={{ angle: -35, textAnchor: "end" }}
                                />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />

                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="total" fill="#000" radius={[4, 4, 0, 0]} name="Total" />
                                <Bar dataKey="completed" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Completed" />
                                <ChartLegend content={<ChartLegendContent />} />
                            </BarChart>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}