import { addNewProjectToDb, getProjectFromDb } from "../lib/sqlite";

export const addNewProject = async (app: any) => {
  app.post("/addNewProject", async (req: any, res: any) => {
    const project = await getProjectFromDb(req.body.projectId);
    if (project) {
      return res.send("Project already exists");
    }

    await addNewProjectToDb(req.body.projectId);
    return res.send("Project added");
  });
};
