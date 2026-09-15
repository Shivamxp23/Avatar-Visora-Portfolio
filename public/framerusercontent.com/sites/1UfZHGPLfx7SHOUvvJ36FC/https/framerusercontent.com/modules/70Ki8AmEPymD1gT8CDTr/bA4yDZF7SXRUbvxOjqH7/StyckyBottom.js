import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, useEffect, useState } from "react"; // Bottom Sticky Scroll
// Works only on 1200px+ screens.
// Apply this override to the frame that should stick to the viewport bottom.
function useMinWidth(width) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const query = window.matchMedia(`(min-width: ${width}px)`);
    const update = () => setMatches(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [width]);
  return matches;
}
export function withBottomStickyScroll(Component) {
  return /*#__PURE__*/ forwardRef((props, ref) => {
    const isDesktop = useMinWidth(1200);
    return /*#__PURE__*/ _jsx(Component, {
      ref: ref,
      ...props,
      style: {
        ...props.style,
        ...(isDesktop
          ? { position: "sticky", bottom: 0, alignSelf: "flex-end", zIndex: 10 }
          : {}),
      },
    });
  });
}
export const __FramerMetadata__ = {
  exports: {
    withBottomStickyScroll: {
      type: "reactHoc",
      name: "withBottomStickyScroll",
      annotations: { framerContractVersion: "1" },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
//# sourceMappingURL=./StyckyBottom.map
