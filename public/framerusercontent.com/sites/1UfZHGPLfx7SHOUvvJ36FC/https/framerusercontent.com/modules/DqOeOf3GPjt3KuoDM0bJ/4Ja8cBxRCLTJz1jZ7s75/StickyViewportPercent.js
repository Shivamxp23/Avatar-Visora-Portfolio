import { jsx as _jsx } from "react/jsx-runtime";
import {
  forwardRef,
  startTransition,
  useCallback,
  useEffect,
  useState,
} from "react";
import { addPropertyControls, ControlType } from "framer"; // User request: Create a Framer code override that makes an element sticky with a top offset calculated as a percentage of the viewport height.
export function StickyViewportPercent(Component) {
  const Wrapped = /*#__PURE__*/ forwardRef(
    function StickyViewportPercentOverride(props, ref) {
      const { viewportPercent = 50, style, ...rest } = props;
      const [topPx, setTopPx] = useState(0);
      const recalculateTop = useCallback(() => {
        if (typeof window !== "undefined") {
          const nextTop = window.innerHeight * (viewportPercent / 100);
          startTransition(() => setTopPx(nextTop));
        } else {
          startTransition(() => setTopPx(0));
        }
      }, [viewportPercent]);
      useEffect(() => {
        recalculateTop();
        if (typeof window === "undefined") return;
        const handleResize = () => recalculateTop();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, [recalculateTop]);
      return /*#__PURE__*/ _jsx(Component, {
        ref: ref,
        ...rest,
        style: { ...style, position: "sticky", top: `${topPx}px` },
      });
    }
  );
  addPropertyControls(Wrapped, {
    viewportPercent: {
      type: ControlType.Number,
      title: "Viewport %",
      defaultValue: 70,
      min: 0,
      max: 100,
      step: 1,
    },
  });
  return Wrapped;
}
export const __FramerMetadata__ = {
  exports: {
    StickyViewportPercent: {
      type: "reactHoc",
      name: "StickyViewportPercent",
      annotations: { framerContractVersion: "1" },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
//# sourceMappingURL=./StickyViewportPercent.map
