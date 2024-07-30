import { addImportsDir, addPlugin, defineNuxtModule } from "@nuxt/kit";
import {resolve} from "pathe";
import {fileURLToPath} from "url";

export default defineNuxtModule({
    setup() {
        // Add your module setup here
        const runtimeDir = fileURLToPath(new URL("./runtime", import.meta.url));

        addPlugin(resolve(runtimeDir, "plugin"));
        addImportsDir(resolve(runtimeDir, "composables"));
    }
});
