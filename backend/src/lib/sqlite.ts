import { getProjectById } from "../vercel/getProjectById";
import { Settings } from "../commands/updateSettings";
import sqlite3 from "sqlite3";
const db = new sqlite3.Database("./db.sqlite3");

export const initDb = () => {
  db.serialize(() => {
    // Create settings table
    db.run(`
        CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            vercelAPI TEXT NOT NULL,
            discordWebhook TEXT NOT NULL
        );
    `);

    // Create projects table
    console.log("Creating projects table");
    db.run(`
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            gitHub TEXT NOT NULL,
            key TEXT NOT NULL
        );
    `);
  });
};

export const writeSettings = (settings: Settings) => {
  db.serialize(() => {
    db.run(`DELETE FROM settings`);

    const stmt = db.prepare(
      `INSERT INTO settings (vercelAPI, discordWebhook) VALUES (?, ?)`
    );

    stmt.run(settings.vercelAPI, settings.discordWebhook);

    stmt.finalize();
  });
};

export const getSettingsFromDb = async (): Promise<Settings> => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM settings`, (err: any, row: any) => {
      if (err) {
        reject(err);
      }
      resolve(row);
    });
  });
};

export const getProjectsFromDb = async (): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM projects`, (err: any, rows: any) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
};

export const getProjectFromDb = async (key: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM projects WHERE key = ?`,
      [key],
      (err: any, row: any) => {
        if (err) {
          reject(err);
        }
        resolve(row);
      }
    );
  });
};

export const addNewProjectToDb = async (id: number) => {
  const project = await getProjectById(id);
  console.log("Adding new project to db", project);

  db.serialize(() => {
    const stmt = db.prepare(
      `INSERT INTO projects (name, gitHub, key) VALUES (?, ?, ?)`
    );
    stmt.run(project.name, project.link.repo, project.id);
    stmt.finalize();
  });
};
