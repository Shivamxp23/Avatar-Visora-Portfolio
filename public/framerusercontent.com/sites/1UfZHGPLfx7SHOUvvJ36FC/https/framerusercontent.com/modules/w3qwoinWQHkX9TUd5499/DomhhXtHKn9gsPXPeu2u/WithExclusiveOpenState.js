import { jsx as _jsx } from "react/jsx-runtime";
import { createStore } from "https://framer.com/m/framer/store.js@^1.0.0";
import { forwardRef, useId, useEffect, useState } from "react";
const useAccordionStore = createStore({ openId: undefined });
const mountedIds = new Set();
export function withAccordion(Component) {
  return /*#__PURE__*/ forwardRef((props, ref) => {
    const id = useId();
    const [store, setStore] = useAccordionStore();
    const [isDesktop, setIsDesktop] = useState(false);
    useEffect(() => {
      const updateBreakpoint = () => {
        setIsDesktop(window.innerWidth >= 1200);
      };
      updateBreakpoint();
      window.addEventListener("resize", updateBreakpoint);
      return () => {
        window.removeEventListener("resize", updateBreakpoint);
      };
    }, []);
    useEffect(() => {
      if (!isDesktop) return;
      mountedIds.add(id);
      const timeout = setTimeout(() => {
        const openId = store.openId;
        if (openId !== undefined) {
          if (openId === null || !mountedIds.has(openId)) {
            setStore({ openId: undefined });
          }
        }
      }, 0);
      return () => {
        clearTimeout(timeout);
        mountedIds.delete(id);
      };
    }, [isDesktop]);
    if (!isDesktop) {
      return /*#__PURE__*/ _jsx(Component, { ...props, ref: ref });
    }
    const hasInteracted = store.openId !== undefined;
    const isOpen = store.openId === id;
    return /*#__PURE__*/ _jsx(Component, {
      ...props,
      ref: ref,
      ...(hasInteracted && { variant: isOpen ? "Open" : "Closed" }),
      onClick: () => setStore({ openId: isOpen ? null : id }),
    });
  });
}
export const __FramerMetadata__ = {
  exports: {
    withAccordion: {
      type: "reactHoc",
      name: "withAccordion",
      annotations: { framerContractVersion: "1" },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
//# sourceMappingURL=./WithExclusiveOpenState.map
