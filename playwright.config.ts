import { defineConfig } from "@playwright/test"

export default defineConfig({
  timeout: 30_000,
  retries: 1,
  use: {
    baseURL: "http://localhost:3199",
    headless: true,
  },
  webServer: {
    command: "npm run start -- --port 3199",
    url: "http://localhost:3199",
    reuseExistingServer: true,
    timeout: 60_000,
  },
})
