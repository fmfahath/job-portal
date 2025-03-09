import * as Sentry from "@sentry/node"

Sentry.init({
    dsn: "https://9f635d5c11678b800386bb89900ed8ee@o4508943017639936.ingest.us.sentry.io/4508945142710272",
    integrations: [Sentry.mongooseIntegration()],
});