import { getProjectById } from "../queries/getProjectById";
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
    db.run(`
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        );
    `);

    // Create projectSettings table with a foreign key to projects
    db.run(`
        CREATE TABLE IF NOT EXISTS projectSettings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT NOT NULL,
            name TEXT NOT NULL,
            gitHub TEXT NOT NULL,
            projectId INTEGER,
            FOREIGN KEY(projectId) REFERENCES projects(id)
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

export const addNewProjectToDb = async (id: number) => {
  const project = await getProjectById(id);

  let key: number;

  db.serialize(() => {
    const stmt = db.prepare(`INSERT INTO projects (name) VALUES (?)`);
    stmt.run(project.name, function (err: Error) {
      if (err) {
        throw err;
      }
      key = this.lastID;
      db.serialize(() => {
        const stmt = db.prepare(
          `INSERT INTO projectSettings (key, name, gitHub, projectId) VALUES (?, ?, ?, ?)`
        );
        stmt.run(project.id, project.name, project.link.repo, key);
        stmt.finalize();
      });
    });
    stmt.finalize();
  });
};
