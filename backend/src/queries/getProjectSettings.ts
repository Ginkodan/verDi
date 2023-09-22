export type Settings = {
  [key: string]: {
    name: string;
    gitHub: string;
  };
}[];

const dummySettings: Settings = [];
dummySettings.push({
  myId: {
    name: "link",
    gitHub: "https:",
  },
});

export const getProjectSettings = async (app: any) => {
  app.get("/getProjectSettings", async (req: any, res: any) => {
    return res.send(dummySettings);
  });
};
