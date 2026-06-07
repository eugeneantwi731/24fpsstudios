import {
  init_define_globalThis_process_env,
  init_define_global_process_env,
  init_define_process_env
} from "./chunk-3EZRQDAS.js";

// node_modules/astro/dist/runtime/client/visible.prebuilt.js
init_define_global_process_env();
init_define_globalThis_process_env();
init_define_process_env();
var visible_prebuilt_default = `(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value=="object"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event("astro:visible"));})();`;
export {
  visible_prebuilt_default as default
};
//# sourceMappingURL=astro_runtime_client_visible__prebuilt__js.js.map
