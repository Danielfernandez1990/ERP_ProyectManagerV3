{
  "name": "ERP E2E Tests",
  "testDir": "./e2e",
  "fullyParallel": true,
  "forbidOnly": false,
  "retries": 1,
  "workers": 1,
  "reporter": "html",
  "use": {
    "baseURL": "http://localhost:5173",
    "trace": "on-first-retry",
    "screenshot": "only-on-failure",
    "video": "retain-on-failure"
  },
  "webServer": {
    "command": "npm run dev",
    "url": "http://localhost:5173",
    "reuseExistingServer": false,
    "timeout": 120 * 1000
  }
}
