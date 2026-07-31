import { useState } from "react";
import { useParams } from "react-router";

const WorkspaceDetails = () => {

    const { workspaceId } = useParams<{ workspaceId: string }>();
    const [isCreateProject, setIsCreateProject] = useState(false);
    const [isInviteMember, setIsInviteMember] = useState(false);

    if(!workspaceId) {
        return <div>No workspace found</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">Workspace Details</h1>
        </div>
    );
};

export default WorkspaceDetails;