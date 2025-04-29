import { Request, Response } from "express"
import User from "../model/userModel"
import { IProject } from "../types";
import Project from "../model/projectModel";
import { Types } from "mongoose";


const saveProject = async (req: Request, res: Response) => {
  const user = req.user
  const { id, name, data } = req.body

  if (!user) res.status(400).send("You are not logged in! Please login");

  const existingProject: IProject | null = id ? await Project.findById(id) : null

  // Создание нового проекта
  if (!existingProject) {
    const project: IProject = await Project.create({
      name,
      data: JSON.stringify(data),
      userId: req.user?._id
    })

    res.status(200).json({
      project
    })
  } else {
    const project: IProject | null = await Project.findByIdAndUpdate(existingProject._id, {
      name: req.body.name,
      data: JSON.stringify(req.body.data)
    }, { new: true, runValidators: true })

    if (!project) res.status(400).send("Couldn't update");

    res.status(200).json({
      project,
    });
  }
}

const getProjectById = async (req: Request, res: Response) => {
  const user = req.user
  const projectId = req.params.id

  if (!projectId) {
    res.status(400).json({ error: 'Id is required' });
    return;
  }

  try {
    const project: IProject | null = await Project.findById(projectId)
    if (!project) {
      res.status(404).send({ error: "project not found" });
      return;
    }

    // Id владельца проекта
    const userProject = await User.findById(project.userId)

    if (!userProject || (user?._id as Types.ObjectId).toString() !== (userProject?._id as Types.ObjectId).toString()) {
      res.status(400).json({ error: 'No access to project' })
      return
    }

    res.status(200).json({
      project,
    });
  } catch (e) {
    res.status(400).json({ "Error: ": e });
  }
}

const getProjectsByUser = async (req: Request, res: Response) => {
  const user = req.user

  if (!user) res.status(400).send("You are not logged in! Please login");
  try {
    const projects: IProject[] = await Project.find({ 
      'userId': user?._id
    }).select('-data');
    
    res.status(200).json({
      projects
    });
  } catch (e) {
    res.status(400).json({ "Error: ": e });
  }
}

export default { saveProject, getProjectById, getProjectsByUser }