import Workspace from "../models/workspace.js";

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


export { createWorkspace, getWorkspaces };