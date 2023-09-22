import { getSettingsFromDb } from "../lib/sqlite";

export const getSettings = async (app: any) => {
  app.get("/getSettings", async (req: any, res: any) => {
    const settings = await getSettingsFromDb();
    return res.send(settings);
  });
};
