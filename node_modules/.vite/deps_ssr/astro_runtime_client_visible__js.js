import {
  init_define_globalThis_process_env,
  init_define_global_process_env,
  init_define_process_env
} from "./chunk-3EZRQDAS.js";

// node_modules/astro/dist/runtime/client/visible.js
init_define_global_process_env();
init_define_globalThis_process_env();
init_define_process_env();
var visibleDirective = (load, options, el) => {
  const cb = async () => {
    const hydrate = await load();
    await hydrate();
  };
  const rawOptions = typeof options.value === "object" ? options.value : void 0;
  const ioOptions = {
    rootMargin: rawOptions?.rootMargin
  };
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      io.disconnect();
      cb();
      break;
    }
  }, ioOptions);
  for (const child of el.children) {
    io.observe(child);
  }
};
var visible_default = visibleDirective;
export {
  visible_default as default
};
//# sourceMappingURL=astro_runtime_client_visible__js.js.map
