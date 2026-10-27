import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { build } from "esbuild";
import { defineConfig, type Plugin } from "vite";

/**
 * Serves and emits /sandbox.html with the runner bundled inline as a classic script.
 * The iframe runs with an opaque origin (sandbox="allow-scripts", no allow-same-origin), and opaque-origin
 * documents cannot load module scripts without CORS, so the runtime has to live inside the HTML itself.
 */
function sandboxPage(): Plugin {
  const render = async (minify: boolean) => {
    const result = await build({
      entryPoints: [resolve(import.meta.dirname, "src/runner/sandboxEntry.ts")],
      bundle: true,
      format: "iife",
      target: "es2022",
      minify,
      write: false,
    });
    const script = result.outputFiles[0]!.text.replace(/<\/script/gi, "<\\/script");
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>sandbox</title>
<style>
  :root { color-scheme: dark; }
  body { font-family: system-ui, sans-serif; font-size: 14px; color: #e6e9f0; background: #0a0e18; margin: 12px; }
  button, input, select, textarea { font: inherit; }
  .hidden { display: none; }
  .active { outline: 2px solid #f2b84b; }
  table { border-collapse: collapse; } td, th { border: 1px solid #263045; padding: 2px 8px; }
</style>
<script>${script}</script>
</head>
<body></body>
</html>`;
  };

  return {
    name: "brush-sandbox-page",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.split("?")[0] !== "/sandbox.html") return next();
        try {
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.setHeader("Cache-Control", "no-store");
          res.end(await render(false));
        } catch (error) {
          next(error);
        }
      });
    },
    async generateBundle() {
      this.emitFile({ type: "asset", fileName: "sandbox.html", source: await render(true) });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), sandboxPage()],
  // CodeMirror is one lazy chunk (~170 kB gzip), loaded only on challenge pages.
  build: { chunkSizeWarningLimit: 600 },
});
