import axios from "axios";
import { getSettingsFromDb } from "../lib/sqlite";

export const getProjectById = async (id: number) => {
  const settings = await getSettingsFromDb();
  try {
    const response = await axios.get(
      `https://api.vercel.com/v9/projects/${id}`,
      {
        headers: {
          Authorization: `Bearer ${settings.vercelAPI}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
