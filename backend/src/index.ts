import axios from "axios";
import "dotenv/config";
import { postMessageToDiscord } from "./commands/postMessage";
import { getRegisteredProjects } from "./queries/getRegisteredProjects";
import { getSettings } from "./queries/getSettings";
import { updateSettings } from "./commands/updateSettings";
import { getProjectsFromVercel } from "./queries/getProjectsFromVercel";
import { addNewProject } from "./queries/addNewProject";
import express from "express";
import cors from "cors";
import { getProjectsFromDb, initDb } from "./lib/sqlite";
import bodyParser from "body-parser";
initDb();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req: any, res: any) => {
  res.send("Hello World!");
});

getRegisteredProjects(app);
getSettings(app);
updateSettings(app);
addNewProject(app);
getProjectsFromVercel(app);

app.listen(3033, () => {
  console.log("Example app listening on port 3033 !");
});

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

let processedDeployments = new Set();

// TODO: find a better way to do this
const getAllDeployments = async () => {
  const allowedDeployments = await getProjectsFromDb();
  const names = allowedDeployments.map((proj: any) => proj.name);

  if (names.length === 0) {
    return [];
  }

  if (!VERCEL_TOKEN) {
    console.error("VERCEL_TOKEN is not set");
    return [];
  }

  try {
    const response = await axios.get(
      "https://api.vercel.com/v6/deployments?limit=10",
      {
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.deployments.filter((deployment: any) =>
      names.includes(deployment.name)
    );
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getDeploymentData = async (deploymentId: string) => {
  try {
    const response = await axios.get(
      `https://api.vercel.com/v11/now/deployments/${deploymentId}`,
      {
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getDeploymentLogs = async (deploymentId: string) => {
  try {
    const response = await axios.get(
      `https://api.vercel.com/v2/now/deployments/${deploymentId}/events`,
      {
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.filter(
      (log: any) => log.type === "stdout" || log.type === "stderr"
    );
  } catch (error) {
    console.error(error);
  }
};

const addAllDeploymentsToSet = async () => {
  const allowedDeployments = await getProjectsFromDb();

  if (allowedDeployments.length === 0) {
    //timeout to wait for db to be initialized
    console.log("waiting for db to be initialized...");
    setTimeout(() => {
      addAllDeploymentsToSet();
    }, 3000);
    return;
  }

  const names = allowedDeployments.map((proj: any) => proj.name);

  console.log("allowedDeployments", allowedDeployments);

  console.log(`initializing for **${names}**`);
  const allDeployments = await getAllDeployments();
  if (allDeployments.length === 0) {
    return;
  }
  allDeployments.forEach((deployment: any) => {
    processedDeployments.add(deployment.uid);
  });
};

const checkDeploymentStatus = async () => {
  if (processedDeployments.size === 0) {
    await addAllDeploymentsToSet();
  }

  const allDeployments = await getAllDeployments();
  for (const deployment of allDeployments) {
    if (!processedDeployments.has(deployment.uid)) {
      const deploymentData = await getDeploymentData(deployment.uid);

      if (deploymentData.status === "ERROR") {
        console.log("Deployment has failed. Fetching logs...");
        const logs = await getDeploymentLogs(deployment.uid);
        let logsString = "";
        logs.forEach((log: any) => {
          logsString += log.payload.text + "\n";
        });
        await postMessageToDiscord(
          `**Deployment failed** for commit **${
            deploymentData.meta.githubCommitMessage
          }** at ${new Date(deploymentData.createdAt)} on branch **${
            deploymentData.meta.githubCommitRef
          }**. Logs: \`\`\`${logsString}\`\`\``
        );
        processedDeployments.add(deployment.uid);
      }
      if (deploymentData.status === "READY") {
        await postMessageToDiscord(
          `**Deployment successful** for commit **${
            deploymentData.meta.githubCommitMessage
          }** at ${new Date(deploymentData.createdAt)} on branch **${
            deploymentData.meta.githubCommitRef
          }**. URL: https://${deploymentData.url}`
        );
        processedDeployments.add(deployment.uid);
      }
      if (deploymentData.status === "BUILDING") {
        return console.log("Deployment in progress...");
      } else {
        return console.log("nothing to do");
      }
    }
  }
};

setInterval(() => {
  checkDeploymentStatus();
}, 5000);
