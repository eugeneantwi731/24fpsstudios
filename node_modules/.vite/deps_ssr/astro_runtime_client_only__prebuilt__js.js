import {
  init_define_globalThis_process_env,
  init_define_global_process_env,
  init_define_process_env
} from "./chunk-3EZRQDAS.js";

// node_modules/astro/dist/runtime/client/only.prebuilt.js
init_define_global_process_env();
init_define_globalThis_process_env();
init_define_process_env();
var only_prebuilt_default = `(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event("astro:only"));})();`;
export {
  only_prebuilt_default as default
};
//# sourceMappingURL=astro_runtime_client_only__prebuilt__js.js.map
