import "dotenv/config";

const allowedDeployments = process.env.PROJECT_LIST?.split(",") || [];

export const getProjects = async (app: any) => {
  app.get("/projects", async (req: any, res: any) => {
    return res.send(allowedDeployments);
  });
};
