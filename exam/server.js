const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");

const PORT = 3000;
const visitorFile = path.join(__dirname, "visitors.log");
const backupFile = path.join(__dirname, "backup.log");

if (!fs.existsSync(visitorFile)) {
  fs.writeFileSync(visitorFile, "", "utf8");
}

const server = http.createServer((req, res) => {
  const method = req.method;
  const url = req.url;

  console.log(`${method} ${url}`);

  if (method === "GET" && url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end(
      "Server is running"
    );
  }

  if (method === "GET" && url === "/updateUser") {
    const data = `Visitor visited at ${new Date().toISOString()}\n`;

    fs.appendFile(visitorFile, data, (err) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        return res.end("Error writing log");
      }

      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Visitor added successfully");
    });
  }

  else if (method === "GET" && url === "/saveLog") {
    fs.readFile(visitorFile, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        return res.end("Error reading log");
      }

      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(data || "No visitors found");
    });
  }

  else if (method === "POST" && url === "/backup") {
    fs.copyFile(visitorFile, backupFile, (err) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        return res.end("Error creating backup");
      }

      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Backup created successfully");
    });
  }

  else if (method === "GET" && url === "/clearLog") {
    fs.writeFile(visitorFile, "", (err) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        return res.end("Error clearing log");
      }

      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Log cleared successfully");
    });
  }

  else if (method === "GET" && url === "/serverInfo") {
    const info = {
      hostname: os.hostname(),
      platform: os.platform(),
      architecture: os.arch(),
      cpuCores: os.cpus().length,
      totalMemory: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + " GB",
      freeMemory: (os.freemem() / 1024 / 1024 / 1024).toFixed(2) + " GB"
    };

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(info, null, 2));
  }

  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Route not found");
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});