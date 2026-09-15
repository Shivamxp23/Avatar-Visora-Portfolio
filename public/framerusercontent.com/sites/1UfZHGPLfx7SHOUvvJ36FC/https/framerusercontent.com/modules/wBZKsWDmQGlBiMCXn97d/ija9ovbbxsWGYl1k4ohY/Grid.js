// Design grid with 12 columns, 40px margins, 40px gap, and customizable column fill color
import { jsx as _jsx } from "react/jsx-runtime";
import { addPropertyControls, ControlType } from "framer";
import {
  useState,
  useEffect,
  startTransition,
  useMemo,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
/**
 * Design Grid
 * @framerDisableUnlink
 *
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 800
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */ export default function Grid(props) {
  const {
    columnColor,
    keyboardShortcut,
    isVisible: visibilityProp,
    transition,
    numberOfColumns,
    columnGap,
    sideMargin,
  } = props;
  const [isVisible, setIsVisible] = useState(visibilityProp);
  useEffect(() => {
    startTransition(() => setIsVisible(visibilityProp));
  }, [visibilityProp]);
  const parsedKeys = useMemo(() => {
    return keyboardShortcut
      .toLowerCase()
      .split("+")
      .map((k) => k.trim());
  }, [keyboardShortcut]);
  const handleKeyDown = useCallback(
    (event) => {
      const pressedKeys = [];
      if (event.ctrlKey || event.metaKey) pressedKeys.push("ctrl");
      if (event.shiftKey) pressedKeys.push("shift");
      if (event.altKey) pressedKeys.push("alt");
      const key = event.key.toLowerCase();
      if (!["control", "shift", "alt", "meta"].includes(key)) {
        pressedKeys.push(key);
      }
      const matches =
        parsedKeys.length === pressedKeys.length &&
        parsedKeys.every((k) => pressedKeys.includes(k));
      if (matches) {
        event.preventDefault();
        startTransition(() => setIsVisible((prev) => !prev));
      }
    },
    [parsedKeys]
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleKeyDown = (event) => {
      const keys = keyboardShortcut
        .toLowerCase()
        .split("+")
        .map((k) => k.trim());
      const pressedKeys = [];
      if (event.ctrlKey || event.metaKey) pressedKeys.push("ctrl");
      if (event.shiftKey) pressedKeys.push("shift");
      if (event.altKey) pressedKeys.push("alt");
      const key = event.key.toLowerCase();
      if (!["control", "shift", "alt", "meta"].includes(key)) {
        pressedKeys.push(key);
      }
      const matches =
        keys.length === pressedKeys.length &&
        keys.every((k) => pressedKeys.includes(k));
      if (matches) {
        event.preventDefault();
        startTransition(() => setIsVisible((prev) => !prev));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
  const columns = useMemo(
    () => Array.from({ length: numberOfColumns }, (_, i) => i),
    [numberOfColumns]
  );
  return /*#__PURE__*/ _jsx("div", {
    style: {
      width: "100%",
      height: "100%",
      position: "relative",
      display: "flex",
      gap: `${columnGap}px`,
      paddingLeft: `${sideMargin}px`,
      paddingRight: `${sideMargin}px`,
    },
    children: /*#__PURE__*/ _jsx(AnimatePresence, {
      children:
        isVisible &&
        columns.map((index) =>
          /*#__PURE__*/ _jsx(
            motion.div,
            {
              initial: { scaleY: 0, originY: 1 },
              animate: { scaleY: 1, originY: 1 },
              exit: { scaleY: 0, originY: 1 },
              transition: { ...transition, delay: index * 0.05 },
              style: { flex: 1, height: "100%", backgroundColor: columnColor },
            },
            index
          )
        ),
    }),
  });
}
addPropertyControls(Grid, {
  isVisible: {
    type: ControlType.Boolean,
    title: "Visible",
    defaultValue: true,
    enabledTitle: "On",
    disabledTitle: "Off",
  },
  numberOfColumns: {
    type: ControlType.Number,
    title: "Columns",
    defaultValue: 12,
    min: 1,
    max: 24,
    step: 1,
    displayStepper: true,
  },
  columnGap: {
    type: ControlType.Number,
    title: "Gap",
    defaultValue: 40,
    min: 0,
    max: 100,
    step: 1,
    unit: "px",
  },
  sideMargin: {
    type: ControlType.Number,
    title: "Margin",
    defaultValue: 40,
    min: 0,
    max: 200,
    step: 1,
    unit: "px",
  },
  columnColor: {
    type: ControlType.Color,
    title: "Column Color",
    defaultValue: "rgba(0, 153, 255, 0.1)",
  },
  keyboardShortcut: {
    type: ControlType.String,
    title: "Shortcut",
    defaultValue: "Ctrl+G",
    placeholder: "e.g., Ctrl+G or Shift+Alt+G",
  },
  transition: {
    type: ControlType.Transition,
    title: "Animation",
    defaultValue: { type: "spring", stiffness: 400, damping: 30, mass: 1 },
    description: "Component by Avataar Visora",
  },
});
export const __FramerMetadata__ = {
  exports: {
    default: {
      type: "reactComponent",
      name: "Grid",
      slots: [],
      annotations: {
        framerIntrinsicHeight: "800",
        framerContractVersion: "1",
        framerDisableUnlink: "*",
        framerIntrinsicWidth: "1200",
        framerSupportedLayoutWidth: "fixed",
        framerSupportedLayoutHeight: "fixed",
      },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
//# sourceMappingURL=./Grid.map
