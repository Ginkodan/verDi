import { getProjectById as getProjectFromVercel } from "../vercel/getProjectById";

export const getProjectById = async (app: any) => {
  app.get("/getProjectById", async (req: any, res: any) => {
    const { id } = req.query;
    const project = await getProjectFromVercel(id);
    return res.send(project);
  });
};
