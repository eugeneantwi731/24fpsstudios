import {
  init_define_globalThis_process_env,
  init_define_global_process_env,
  init_define_process_env
} from "./chunk-3EZRQDAS.js";

// node_modules/astro/dist/runtime/client/only.js
init_define_global_process_env();
init_define_globalThis_process_env();
init_define_process_env();
var onlyDirective = async (load) => {
  const hydrate = await load();
  await hydrate();
};
var only_default = onlyDirective;
export {
  only_default as default
};
//# sourceMappingURL=astro_runtime_client_only__js.js.map
