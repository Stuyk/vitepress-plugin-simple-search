import { createApp } from "vue";

export function withSetup(composable: Function) {
  let result;
  const app = createApp({
    setup() {
      result = composable();

      // suppress missing template warning
      return () => {};
    },
  });

  app.mount(document.createElement("div"));

  return { result, app };
}
