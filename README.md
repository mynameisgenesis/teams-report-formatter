# Teams Report Formatter

A small React/Vite app for formatting Teams status reports.

## Local development

Install dependencies:

```bash
npm install
```

Run the Vite dev server:

```bash
npm run dev
```

By default, Vite prints the local URL in the terminal, usually:

```text
http://localhost:5173
```

Use this mode when you are changing React code and want hot reload.

## Production Docker run

This app is designed to run behind your Mainframe dashboard, where Mainframe owns host port `80`.

Create the shared Docker network once:

```bash
docker network create mainframe
```

Start this app:

```bash
docker compose up -d --build
```

The formatter will be available on your machine at:

```text
http://localhost:8081
```

Inside Docker, Mainframe can reach it at:

```text
http://teams-report-formatter:80
```

Think of Mainframe as the front desk on public port `80`, and this formatter as another room in the same Docker building. The `mainframe` network is the hallway that lets Mainframe reach `teams-report-formatter:80` without this app also trying to own public port `80`.

## Connect Mainframe to this app

In your Mainframe dashboard `docker-compose.yml`, attach the `web` service to the same external network:

```yaml
services:
  api:
    build: ./backend
    ports:
      - "3001:3001"
    volumes:
      - ./backend/data:/app/data
    restart: unless-stopped

  web:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - api
    restart: unless-stopped
    networks:
      - mainframe

networks:
  mainframe:
    external: true
```

Then run both projects:

```bash
# From this teams-report-formatter repo
docker compose up -d --build

# From the Mainframe dashboard repo
docker compose up -d --build
```

If Mainframe uses Nginx or another reverse proxy, point its route for this app to:

```text
http://teams-report-formatter:80
```

## Useful commands

Check that the compose file is valid:

```bash
docker compose config
```

Stop this app:

```bash
docker compose down
```

Use a different local host port:

```bash
TEAMS_REPORT_FORMATTER_PORT=8082 docker compose up -d --build
```

