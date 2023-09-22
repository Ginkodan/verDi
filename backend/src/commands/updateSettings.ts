import { writeSettings } from "../lib/sqlite";

export type Settings = {
  vercelAPI: string;
  discordWebhook: string;
};

export const updateSettings = async (app: any) => {
  app.post("/updateSettings", async (req: any, res: any) => {
    const settings: Settings = req.body;
    writeSettings(settings);
    return res.send("OK");
  });
};
