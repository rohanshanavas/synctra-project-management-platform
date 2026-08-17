import Workspace from "../models/workspace.js";
import Project from "../models/project.js";
import Task from "../models/task.js";
import ActivityLog from "../models/activity.js";
import Comment from "../models/comment.js";
import WorkspaceInvite from "../models/workspace-invite.js";
import { sendEmail } from "../libs/sendEmail.js";
import jwt from "jsonwebtoken";
import { recordActivity } from "../libs/index.js";
import User from "../models/user.js";

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

const updateWorkspace = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { name, description, color } = req.body;

        const workspace = await Workspace.findById(workspaceId);

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const userId = req.user._id.toString();

        if (workspace.owner.toString() !== userId) {
            return res.status(403).json({ message: "Only workspace owner can update workspace settings" });
        }

        if (typeof name === "string") {
            workspace.name = name;
        }

        if (typeof description === "string") {
            workspace.description = description;
        }

        if (typeof color === "string") {
            workspace.color = color;
        }

        await workspace.save();

        res.status(200).json(workspace);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const transferWorkspaceOwnership = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { newOwnerId } = req.body;

        const workspace = await Workspace.findById(workspaceId).populate("members.user", "name email profilePicture");

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const currentOwnerId = req.user._id.toString();

        if (workspace.owner.toString() !== currentOwnerId) {
            return res.status(403).json({ message: "Only workspace owner can transfer ownership" });
        }

        if (newOwnerId === currentOwnerId) {
            return res.status(400).json({ message: "You already own this workspace" });
        }

        const nextOwnerMember = workspace.members.find((member) => member.user._id.toString() === newOwnerId);

        if (!nextOwnerMember) {
            return res.status(400).json({ message: "Selected user is not a workspace member" });
        }

        workspace.owner = newOwnerId;

        workspace.members.forEach((member) => {
            const memberId = member.user._id.toString();

            if (memberId === currentOwnerId) {
                member.role = "admin";
            }

            if (memberId === newOwnerId) {
                member.role = "owner";
            }
        });

        await workspace.save();

        res.status(200).json({ message: "Workspace ownership transferred successfully", workspace });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteWorkspace = async (req, res) => {
    try {
        const { workspaceId } = req.params;

        const workspace = await Workspace.findById(workspaceId);

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const userId = req.user._id.toString();

        if (workspace.owner.toString() !== userId) {
            return res.status(403).json({ message: "Only workspace owner can delete this workspace" });
        }

        const projects = await Project.find({ workspace: workspaceId }, "_id");
        const projectIds = projects.map((project) => project._id);

        const tasks = await Task.find({ project: { $in: projectIds } }, "_id");
        const taskIds = tasks.map(task => task._id);

        await Promise.all([
            ActivityLog.deleteMany({ resourceType: "Task", resourceId: { $in: taskIds } }),

            Comment.deleteMany({ task: { $in: taskIds } }),

            Task.deleteMany({ project: { $in: projectIds } }),

            Project.deleteMany({ workspace: workspaceId }),

            Workspace.deleteOne({ _id: workspaceId })
        ]);

        res.status(200).json({ message: "Workspace deleted successfully" });
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

        const workspace = await Workspace.findById({ _id: workspaceId }).populate("members.user", "name email profilePicture");

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
            workspace: workspaceId,
            isArchived: false,
            "members.user": { $in: [userId] }
        }).sort({ createdAt: -1 });

        res.status(200).json({ projects, workspace });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getWorkspaceStats = async (req, res) => {
    try {
        const { workspaceId } = req.params;

        const workspace = await Workspace.findById(workspaceId);

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const isMember = workspace.members.some(member => member.user.toString() === req.user._id.toString());

        if (!isMember) {
            return res.status(403).json({ message: "You are not a member of this workspace" });
        }

        const [totalProjects, projects] = await Promise.all([
            Project.countDocuments({ workspace: workspaceId }),
            Project.find({ workspace: workspaceId }).populate("tasks", "title status dueDate project updatedAt isArchived priority").sort({ createdAt: -1 })
        ]);

        const totalTasks = projects.reduce((acc, project) => acc + project.tasks.length, 0);

        const totalProjectInProgress = projects.filter((project) => project.status === "In Progress").length;

        const totalProjectCompleted = projects.filter((project) => project.status === "Completed").length;

        const totalTaskCompleted = projects.reduce((acc, project) => acc + project.tasks.filter((task) => task.status === "Done").length, 0);

        const totalTaskToDo = projects.reduce((acc, project) => acc + project.tasks.filter((task) => task.status === "To Do").length, 0);

        const totalTaskInProgress = projects.reduce((acc, project) => acc + project.tasks.filter((task) => task.status === "In Progress").length, 0);

        const tasks = projects.flatMap((project) => project.tasks);

        const upcomingTasks = tasks.filter((task) => {
            const dueDate = new Date(task.dueDate);
            const now = new Date();
            return dueDate > now && dueDate <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) && task.status !== "Done";
        });

        const taskTrendsData = [
            { name: "Sun", completed: 0, inProgress: 0, toDo: 0 },
            { name: "Mon", completed: 0, inProgress: 0, toDo: 0 },
            { name: "Tue", completed: 0, inProgress: 0, toDo: 0 },
            { name: "Wed", completed: 0, inProgress: 0, toDo: 0 },
            { name: "Thu", completed: 0, inProgress: 0, toDo: 0 },
            { name: "Fri", completed: 0, inProgress: 0, toDo: 0 },
            { name: "Sat", completed: 0, inProgress: 0, toDo: 0 }
        ]

        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date;
        }).reverse();

        for (const project of projects) {
            for (const task of project.tasks) {
                const taskDate = new Date(task.updatedAt);

                const dayInDate = last7Days.findIndex((date) =>
                    date.getDate() === taskDate.getDate() &&
                    date.getMonth() === taskDate.getMonth() &&
                    date.getFullYear() === taskDate.getFullYear()
                );

                if (dayInDate !== -1) {

                    const dayName = last7Days[dayInDate].toLocaleDateString("en-US", { weekday: "short" });

                    const dayData = taskTrendsData.find((day) => day.name === dayName);

                    if (dayData) {
                        switch (task.status) {
                            case "Done":
                                dayData.completed++;
                                break;
                            case "In Progress":
                                dayData.inProgress++;
                                break;
                            case "To Do":
                                dayData.toDo++;
                                break;
                        }
                    }
                }
            }
        }

        const projectStatusData = [
            { name: "Completed", value: 0, color: "#10b981" },
            { name: "In Progress", value: 0, color: "#3b82f6" },
            { name: "Planning", value: 0, color: "#f59e0b" }
        ];

        for (const project of projects) {
            switch (project.status) {
                case "Completed":
                    projectStatusData[0].value++;
                    break;
                case "In Progress":
                    projectStatusData[1].value++;
                    break;
                case "Planning":
                    projectStatusData[2].value++;
                    break;
            }
        }

        const taskPriorityData = [
            { name: "High", value: 0, color: "#ef4444" },
            { name: "Medium", value: 0, color: "#f59e0b" },
            { name: "Low", value: 0, color: "#6b7280" }
        ];

        for (const task of tasks) {
            switch (task.priority) {
                case "High":
                    taskPriorityData[0].value++;
                    break;
                case "Medium":
                    taskPriorityData[1].value++;
                    break;
                case "Low":
                    taskPriorityData[2].value++;
                    break;
            }
        }

        const workspaceProductivityData = [];

        for (const project of projects) {

            const projectTasks = tasks.filter((task) => task.project.toString() === project._id.toString());

            const completedTasks = projectTasks.filter((task) => task.status === "Done" && task.isArchived === false);

            workspaceProductivityData.push({
                name: project.title,
                completed: completedTasks.length,
                total: projectTasks.length
            });
        }

        const stats = {
            totalProjects,
            totalTasks,
            totalProjectInProgress,
            totalProjectCompleted,
            totalTaskCompleted,
            totalTaskToDo,
            totalTaskInProgress
        };


        res.status(200).json({ stats, taskTrendsData, projectStatusData, taskPriorityData, workspaceProductivityData, upcomingTasks, recentProjects: projects.slice(0, 5) });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


const getArchivedItems = async (req, res) => {
    try {
        const { workspaceId } = req.params;

        const workspace = await Workspace.findById(workspaceId);

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const isMember = workspace.members.some(member => member.user.toString() === req.user._id.toString());

        if (!isMember) {
            return res.status(403).json({ message: "You are not a member of this workspace" });
        }

        const archivedProjects = await Project.find({ workspace: workspaceId, isArchived: true }).sort({ updatedAt: -1 });

        const workspaceProjects = await Project.find({ workspace: workspaceId }, "_id");
        const projectIds = workspaceProjects.map(p => p._id);

        const archivedTasks = await Task.find({ project: { $in: projectIds }, isArchived: true })
            .populate("project", "title")
            .sort({ updatedAt: -1 });

        res.status(200).json({ archivedProjects, archivedTasks });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const inviteMembertoWorkspace = async (req, res) => {

    try {
        const { workspaceId } = req.params;
        const { email, role } = req.body;

        const workspace = await Workspace.findById(workspaceId);

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const userMemberInfo = workspace.members.find((member) => member.user.toString() === req.user._id.toString());

        if (!userMemberInfo || !["owner", "admin"].includes(userMemberInfo.role)) {
            return res.status(403).json({ message: "You are not authorized to invite members to this workspace" });
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMember = workspace.members.some((member) => member.user.toString() === existingUser._id.toString());

        if (isMember) {
            return res.status(400).json({ message: "User is already a member of this workspace" });
        }

        const isInvited = await WorkspaceInvite.findOne({ user: existingUser._id, workspaceId: workspaceId });

        if (isInvited && isInvited.expiresAt > new Date()) {
            return res.status(400).json({ message: "User has already been invited to this workspace" });
        }

        if (isInvited && isInvited.expiresAt < new Date()) {
            await WorkspaceInvite.deleteOne({ _id: isInvited._id });
        }

        const inviteToken = jwt.sign({ userId: existingUser._id, workspaceId: workspaceId, role: role || "member" }, process.env.JWT_SECRET, { expiresIn: '7d' });

        await WorkspaceInvite.create({
            user: existingUser._id,
            workspaceId: workspaceId,
            token: inviteToken,
            role: role || "member",
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        const invitationLink = `${process.env.FRONTEND_URL}/workspace-invite/${workspace._id}?token=${inviteToken}`;

        const emailBody = `<p>Hi ${existingUser.name},</p>
                <p>You have been invited to join the workspace "${workspace.name}". Please click the link below to accept the invitation:</p>
                <a href="${invitationLink}">Accept Invitation</a>
                <p>This link will expire in 7 days.</p>`;

        const emailSubject = `Workspace Invitation: ${workspace.name}`;

        const isEmailSent = await sendEmail(email, emailSubject, emailBody);

        if (!isEmailSent) {
            return res.status(500).json({ message: "Failed to send invitation email" });
        }

        res.status(200).json({ message: "Member invited successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const acceptWorkspaceInvite = async (req, res) => {
    try {
        const { workspaceId } = req.params;

        const workspace = await Workspace.findById(workspaceId);

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const isMember = workspace.members.some((member) => member.user.toString() === req.user._id.toString());

        if (isMember) {
            return res.status(400).json({ message: "You are already a member of this workspace" });
        }

        workspace.members.push({
            user: req.user._id,
            role: "member",
            joinedAt: new Date()
        });

        await workspace.save();

        await recordActivity(req.user._id, "joined_workspace", "Workspace", workspaceId, { description: `Joined the workspace "${workspace.name}"` });

        res.status(200).json({ message: "Invitation accepted successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const acceptInviteByToken = async (req, res) => {
    try {
        const { token } = req.body;

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const { userId, workspaceId, role } = decodedToken;

        const workspace = await Workspace.findById(workspaceId);

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const isMember = workspace.members.some((member) => member.user.toString() === userId.toString());

        if (isMember) {
            return res.status(400).json({ message: "You are already a member of this workspace" });
        }

        const inviteInfo = await WorkspaceInvite.findOne({ user: userId, workspaceId: workspaceId });

        if (!inviteInfo) {
            return res.status(404).json({ message: "Invitation not found" });
        }

        if (inviteInfo.expiresAt < new Date()) {
            return res.status(400).json({ message: "Invitation has expired" });
        }

        workspace.members.push({
            user: userId,
            role: role || "member",
            joinedAt: new Date()
        });

        await workspace.save();

        await Promise.all([
            WorkspaceInvite.deleteOne({ _id: inviteInfo._id }),
            recordActivity(userId, "joined_workspace", "Workspace", workspaceId, { description: `Joined the workspace "${workspace.name}"` })
        ]);

        res.status(200).json({ message: "Invitation accepted successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export {
    createWorkspace,
    updateWorkspace,
    transferWorkspaceOwnership,
    deleteWorkspace,
    getWorkspaces,
    getWorkspaceDetails,
    getWorkspaceProjects,
    getWorkspaceStats,
    getArchivedItems,
    acceptWorkspaceInvite,
    acceptInviteByToken,
    inviteMembertoWorkspace
};