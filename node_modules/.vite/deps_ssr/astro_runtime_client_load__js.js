import {
  init_define_globalThis_process_env,
  init_define_global_process_env,
  init_define_process_env
} from "./chunk-3EZRQDAS.js";

// node_modules/astro/dist/runtime/client/load.js
init_define_global_process_env();
init_define_globalThis_process_env();
init_define_process_env();
var loadDirective = async (load) => {
  const hydrate = await load();
  await hydrate();
};
var load_default = loadDirective;
export {
  load_default as default
};
//# sourceMappingURL=astro_runtime_client_load__js.js.map
