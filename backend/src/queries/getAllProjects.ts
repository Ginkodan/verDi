import axios from "axios";

export const getAllProjects = async (token: string) => {
  try {
    const response = await axios.get("https://api.vercel.com/v9/projects", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data.projects.map((project: any) => ({
      name: project.name,
      id: project.id,
      repo: project.link.repo,
      alias: project.latestDeployments[0].alias,
      createdAt: project.latestDeployments[0].createdAt,
    }));
  } catch (error) {
    console.error(error);
  }
};
