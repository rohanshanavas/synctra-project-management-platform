import type { Project } from "@/types";

interface ProjectCardProps {
    project: Project;
    progress: number;
    workspaceId: string;
}

export const ProjectCard = ({ project, progress, workspaceId }: ProjectCardProps) => {

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h4 className="text-lg font-semibold mb-2">{project.title}</h4>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-gray-600 text-sm">Progress: {progress}%</p>
        </div>
    );
}