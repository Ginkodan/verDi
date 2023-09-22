import { addNewProjectToDb } from "../lib/sqlite";

export const addNewProject = async (app: any) => {
  app.post("/addNewProject", async (req: any, res: any) => {
    await addNewProjectToDb(req.body.projectId);
    return res.send("Project added");
  });
};
