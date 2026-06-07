import {
  init_define_globalThis_process_env,
  init_define_global_process_env,
  init_define_process_env
} from "./chunk-3EZRQDAS.js";

// node_modules/astro/dist/runtime/client/idle.prebuilt.js
init_define_global_process_env();
init_define_globalThis_process_env();
init_define_process_env();
var idle_prebuilt_default = `(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value=="object"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};"requestIdleCallback"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event("astro:idle"));})();`;
export {
  idle_prebuilt_default as default
};
//# sourceMappingURL=astro_runtime_client_idle__prebuilt__js.js.map
