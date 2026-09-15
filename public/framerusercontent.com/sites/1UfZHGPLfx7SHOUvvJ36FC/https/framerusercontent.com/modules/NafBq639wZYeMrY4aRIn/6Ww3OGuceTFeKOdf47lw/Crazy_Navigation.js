import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { createStore } from "https://framer.com/m/framer/store.js@^1.0.0"; // Custom cubic-bezier transition
const bezierTransition = {
  type: "tween",
  ease: [0.6, 0, 0.4, 1],
  duration: 0.8,
}; // Instant transition
const instantTransition = { type: "tween", duration: 0, delay: 0.2 }; // Store to manage the transform of the target element
const useTransformStore = createStore({
  scale: 1,
  x: 0,
  rotate: 0,
  instant: false,
});
export function withTargetElement(Component) {
  return /*#__PURE__*/ forwardRef((props, ref) => {
    const [store] = useTransformStore();
    return /*#__PURE__*/ _jsx(Component, {
      ref: ref,
      ...props,
      animate: { scale: store.scale, x: store.x, rotate: store.rotate },
      transition: store.instant ? instantTransition : bezierTransition,
    });
  });
}
export function withTrigger(Component) {
  return /*#__PURE__*/ forwardRef((props, ref) => {
    const [, setStore] = useTransformStore();
    return /*#__PURE__*/ _jsx(Component, {
      ref: ref,
      ...props,
      onTap: () => {
        let offset = "-50%"; // Offset on Desktop & Tablet
        if (typeof window !== "undefined" && window.innerWidth < 810) {
          offset = "-100%"; // Offset on Phone
        }
        setStore({ scale: 1, x: offset, rotate: 12, instant: false }); // Disable scrolling
        if (typeof window !== "undefined") {
          document.body.style.overflow = "hidden";
        }
      },
    });
  });
} // Reset with animation
export function withReset(Component) {
  return /*#__PURE__*/ forwardRef((props, ref) => {
    const [, setStore] = useTransformStore();
    return /*#__PURE__*/ _jsx(Component, {
      ref: ref,
      ...props,
      onTap: () => {
        setStore({ scale: 1, x: 0, rotate: 0, instant: false }); // Enable scrolling
        if (typeof window !== "undefined") {
          document.body.style.overflow = "";
        }
      },
    });
  });
} // Reset instantly, without animation
export function withInstantReset(Component) {
  return /*#__PURE__*/ forwardRef((props, ref) => {
    const [, setStore] = useTransformStore();
    return /*#__PURE__*/ _jsx(Component, {
      ref: ref,
      ...props,
      onTap: () => {
        setStore({ scale: 1, x: 0, rotate: 0, instant: true }); // Enable scrolling
        if (typeof window !== "undefined") {
          document.body.style.overflow = "";
        }
      },
    });
  });
}
export const __FramerMetadata__ = {
  exports: {
    withTargetElement: {
      type: "reactHoc",
      name: "withTargetElement",
      annotations: { framerContractVersion: "1" },
    },
    withReset: {
      type: "reactHoc",
      name: "withReset",
      annotations: { framerContractVersion: "1" },
    },
    withInstantReset: {
      type: "reactHoc",
      name: "withInstantReset",
      annotations: { framerContractVersion: "1" },
    },
    withTrigger: {
      type: "reactHoc",
      name: "withTrigger",
      annotations: { framerContractVersion: "1" },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
//# sourceMappingURL=./Crazy_Navigation.map
