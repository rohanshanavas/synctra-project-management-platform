import Workspace from "../models/workspace.js";
import Project from "../models/project.js";

const createWorkspace = async (req, res) => {
    try {
        const { name, description, color } = req.body;
        const userId = req.user._id;

        const workspace = await Workspace.create({
            name,
            description,
            color,
            owner: userId,
            members: [{
                user: userId,
                role: "owner",
                joinedAt: new Date()
            }]
        });

        console.log("Workspace created successfully:", workspace);
        res.status(201).json(workspace);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getWorkspaces = async (req, res) => {
    try {
        const userId = req.user._id;

        const workspaces = await Workspace.find({
            "members.user": userId
        }).sort({ createdAt: -1 });

        res.status(200).json(workspaces);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getWorkspaceDetails = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const userId = req.user._id;
        const workspace = await Workspace.findOne({ 
            _id: workspaceId,
            "members.user": userId
        }).populate("members.user", "name email profilePicture");

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        res.status(200).json(workspace);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getWorkspaceProjects = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const userId = req.user._id;
        const workspace = await Workspace.findOne({ 
            _id: workspaceId,
            "members.user": userId
        }).populate("members.user", "name email profilePicture");

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const projects = await Project.find({ 
            workspace: workspaceId ,
            isArchived: false,
            members: { $in: [userId] }
        }).populate("tasks", "status").sort({ createdAt: -1 });

        res.status(200).json({ projects, workspace });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export { createWorkspace, getWorkspaces, getWorkspaceDetails, getWorkspaceProjects };