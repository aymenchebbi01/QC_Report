import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import os from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("reports.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_number TEXT UNIQUE,
    data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.get("/api/reports", (req, res) => {
    try {
      const reports = db.prepare("SELECT * FROM reports ORDER BY created_at DESC").all();
      res.json(reports.map(r => ({ ...r, data: JSON.parse(r.data as string) })));
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.get("/api/reports/:id", (req, res) => {
    try {
      const report = db.prepare("SELECT * FROM reports WHERE id = ?").get(req.params.id);
      if (!report) return res.status(404).json({ error: "Report not found" });
      res.json({ ...report, data: JSON.parse((report as any).data) });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.post("/api/reports", (req, res) => {
    try {
      const { report_number, data } = req.body;
      const result = db.prepare("INSERT INTO reports (report_number, data) VALUES (?, ?)").run(report_number, JSON.stringify(data));
      res.json({ id: result.lastInsertRowid });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.put("/api/reports/:id", (req, res) => {
    try {
      const { data } = req.body;
      db.prepare("UPDATE reports SET data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(JSON.stringify(data), req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.delete("/api/reports/:id", (req, res) => {
    try {
      db.prepare("DELETE FROM reports WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        host: true // allow HMR from network
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n  ➜  Local:   http://localhost:${PORT}`);
    
    // Print local network IPs
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]!) {
        if (iface.family === 'IPv4' && !iface.internal) {
          console.log(`  ➜  Network: http://${iface.address}:${PORT}`);
        }
      }
    }
    console.log('');
  });
}

startServer();
