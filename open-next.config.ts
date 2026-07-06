// OpenNext Cloudflare configuration
// See: https://opennext.js.org/cloudflare/get-started
import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";

export default defineCloudflareConfig({
  // Bundle all server chunks into the worker to avoid ChunkLoadError
  // This prevents runtime chunk loading failures on Cloudflare Workers
  minify: true,
});
