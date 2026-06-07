import "./chunk-G3PMV62Z.js";

// node_modules/astro/dist/runtime/client/media.js
var mediaDirective = (load, options) => {
  const cb = async () => {
    const hydrate = await load();
    await hydrate();
  };
  if (options.value) {
    const mql = matchMedia(options.value);
    if (mql.matches) {
      cb();
    } else {
      mql.addEventListener("change", cb, { once: true });
    }
  }
};
var media_default = mediaDirective;
export {
  media_default as default
};
//# sourceMappingURL=astro_runtime_client_media__js.js.map
