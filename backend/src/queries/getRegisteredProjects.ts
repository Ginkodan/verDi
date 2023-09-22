import "dotenv/config";
import { getProjectsFromDb } from "../lib/sqlite";

export const getRegisteredProjects = async (app: any) => {
  app.get("/getRegisteredProjects", async (req: any, res: any) => {
    const projects = await getProjectsFromDb();
    return res.send(projects);
  });
};
