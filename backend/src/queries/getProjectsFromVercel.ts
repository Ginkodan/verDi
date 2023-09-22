import { getSettingsFromDb } from "../lib/sqlite";
import { getAllProjects } from "./getAllProjects";

export const getProjectsFromVercel = async (app: any) => {
  app.get("/getProjectsFromVercel", async (req: any, res: any) => {
    const settings = await getSettingsFromDb();
    const deployments = await getAllProjects(settings.vercelAPI);
    return res.send(deployments);
  });
};
