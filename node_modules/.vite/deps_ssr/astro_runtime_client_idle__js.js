import {
  init_define_globalThis_process_env,
  init_define_global_process_env,
  init_define_process_env
} from "./chunk-3EZRQDAS.js";

// node_modules/astro/dist/runtime/client/idle.js
init_define_global_process_env();
init_define_globalThis_process_env();
init_define_process_env();
var idleDirective = (load, options) => {
  const cb = async () => {
    const hydrate = await load();
    await hydrate();
  };
  const rawOptions = typeof options.value === "object" ? options.value : void 0;
  const idleOptions = {
    timeout: rawOptions?.timeout
  };
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(cb, idleOptions);
  } else {
    setTimeout(cb, idleOptions.timeout || 200);
  }
};
var idle_default = idleDirective;
export {
  idle_default as default
};
//# sourceMappingURL=astro_runtime_client_idle__js.js.map
