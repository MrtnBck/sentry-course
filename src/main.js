import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "@/assets/main.pcss";
import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";

const app = createApp(App);

Sentry.init({
  app,
  dsn: "https://4cc57cf92c6b3c0337b5aedb45db1d4a@o4505736699314176.ingest.sentry.io/4505736702459904",
  logErrors: true,
  release: __SENTRY_RELEASE__,
  environment: import.meta.env.MODE, //development, production
  integrations: [
    new Integrations.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracingOrigins: ["localhost", "my-site-url.com", /^\//],
    }),
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  //Performance monitoring
  tracesSampleRate: 0.2, //20% of the transaction will be send to sentry
});

app.use(router).mount("#app");

const user = {
  email: "martin@lobo.at",
};

Sentry.setUser(user);

Sentry.configureScope((scope) => scope.setUser(null));

//Sessions:
//use sentry to monitor health
//represents the interaction between the user and the application
//session start: open the app
//session end: close the app, navigate to another tab in the browser
//executor: Sentry.init()
