import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useState } from "react";
import { addPropertyControls, ControlType, useTracking } from "framer";
import { motion } from "framer-motion";
export default function Clipboard(props) {
  const {
    label = "Copy to Clipboard",
    success = "Copied!",
    content,
    trackingId,
    fill = "#06F",
    color = "#FFF", // Font control lives at top-level again
    font = {
      fontFamily: "Inter",
      fontWeight: 500,
      fontSize: 16,
      lineHeight: 1,
    },
    hoverOptions,
    style,
    onClick, // padding & radius controls (top-level, ungrouped)
    padding = 10,
    paddingPerSide,
    paddingTop = 10,
    paddingRight = 10,
    paddingBottom = 10,
    paddingLeft = 10,
    borderRadius = 50,
    isMixedBorderRadius,
    topLeftRadius = 50,
    topRightRadius = 50,
    bottomRightRadius = 50,
    bottomLeftRadius = 50,
    ...rest
  } = props; // Padding string from fused control
  const paddingValue = paddingPerSide
    ? `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`
    : `${padding}px`; // Radius string from fused control
  const radiusValue = isMixedBorderRadius
    ? `${topLeftRadius}px ${topRightRadius}px ${bottomRightRadius}px ${bottomLeftRadius}px`
    : `${borderRadius}px`;
  const track = useTracking();
  const [copied, setCopied] = useState(false);
  const safeContent = content ?? "";
  const legacyCopy = (text) => {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  };
  const handleClick = useCallback(async () => {
    let ok = false;
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(safeContent);
        ok = true;
      } else if (typeof document !== "undefined") {
        ok = legacyCopy(safeContent);
      }
    } catch {
      if (typeof document !== "undefined") ok = legacyCopy(safeContent);
    }
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3); // 2s success state
    }
    if (trackingId) track(trackingId);
    onClick?.();
  }, [safeContent, onClick, trackingId, track]);
  return /*#__PURE__*/ _jsxs(motion.button, {
    type: "button",
    style: {
      // Default font (Download parity) + user overrides
      fontFamily: "Inter",
      fontWeight: 500,
      fontSize: 16,
      lineHeight: 1,
      display: "inline-flex",
      position: "relative",
      placeItems: "center",
      placeContent: "center",
      whiteSpace: "nowrap",
      backgroundColor: fill,
      color,
      borderRadius: radiusValue,
      padding: paddingValue,
      cursor: "pointer",
      userSelect: "none",
      letterSpacing: "-0.2px",
      WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
      border: "none",
      outline: "none", // external overrides last
      ...style,
      ...font,
    },
    onClick: handleClick,
    ...rest,
    whileHover: hoverOptions,
    transition: hoverOptions?.transition, // Remove borders/outlines even if browser applies any
    onFocus: (e) => {
      e.currentTarget.style.outline = "none";
      e.currentTarget.style.border = "none";
      e.currentTarget.style.boxShadow = "none";
    },
    onBlur: (e) => {
      e.currentTarget.style.outline = "none";
      e.currentTarget.style.border = "none";
      e.currentTarget.style.boxShadow = "none";
    },
    onMouseDown: (e) => {
      e.currentTarget.style.outline = "none";
      e.currentTarget.style.border = "none";
      e.currentTarget.style.boxShadow = "none";
    },
    onMouseUp: (e) => {
      e.currentTarget.style.outline = "none";
      e.currentTarget.style.border = "none";
      e.currentTarget.style.boxShadow = "none";
    },
    "aria-live": "polite",
    "aria-label": label,
    children: [
      /*#__PURE__*/ _jsx("span", {
        "aria-hidden": true,
        style: {
          position: "absolute",
          visibility: "hidden",
          whiteSpace: "nowrap",
          pointerEvents: "none",
        },
        children: label,
      }),
      /*#__PURE__*/ _jsxs("span", {
        style: { position: "relative", display: "grid", placeItems: "center" },
        children: [
          /*#__PURE__*/ _jsx(
            motion.span,
            {
              style: { gridArea: "1 / 1", whiteSpace: "nowrap" },
              initial: false,
              animate: { opacity: copied ? 0 : 1 },
              transition: { duration: 0.25 },
              children: label,
            },
            "label"
          ),
          /*#__PURE__*/ _jsx(
            motion.span,
            {
              style: { gridArea: "1 / 1", whiteSpace: "nowrap" },
              initial: false,
              animate: { opacity: copied ? 1 : 0 },
              transition: { duration: 0.25 },
              "aria-hidden": !copied,
              children: success,
            },
            "success"
          ),
        ],
      }),
    ],
  });
}
Clipboard.displayName = "Clipboard";
addPropertyControls(Clipboard, {
  content: {
    type: ControlType.String,
    title: "Content",
    displayTextArea: true,
    defaultValue: "When clicked, this will be copied to the clipboard.",
  },
  label: {
    title: "Label",
    type: ControlType.String,
    defaultValue: "Copy to Clipboard",
  },
  success: {
    title: "Success",
    type: ControlType.String,
    defaultValue: "Copied!",
  },
  trackingId: {
    title: "Tracking",
    type: ControlType.TrackingId,
    placeholder: "ID",
  }, // Ungrouped style controls
  fill: { type: ControlType.Color, title: "Fill", defaultValue: "#06F" },
  color: { type: ControlType.Color, title: "Text", defaultValue: "#FFF" },
  font: {
    // @ts-ignore - Internal
    type: ControlType.Font,
    title: "Font",
    controls: "extended",
    defaultValue: {
      fontFamily: "Inter",
      fontWeight: 500,
      fontSize: 16,
      lineHeight: 1,
    },
  },
  hoverOptions: {
    type: ControlType.Object,
    title: "Hover",
    buttonTitle: "Effect",
    optional: true,
    controls: {
      scale: {
        type: ControlType.Number,
        title: "Scale",
        min: 0,
        max: 10,
        displayStepper: true,
        step: 0.01,
        defaultValue: 1.05,
      },
      backgroundColor: {
        type: ControlType.Color,
        title: "Fill",
        defaultValue: "#0088FF",
        optional: true,
      },
      color: {
        type: ControlType.Color,
        title: "Color",
        defaultValue: "#FFF",
        optional: true,
      },
      transition: {
        type: ControlType.Transition,
        title: "Transition",
        defaultValue: { type: "spring", stiffness: 400, damping: 30 },
      },
    },
  },
  padding: {
    title: "Padding",
    type: ControlType.FusedNumber,
    toggleKey: "paddingPerSide",
    toggleTitles: ["Padding", "Padding per side"],
    defaultValue: 10,
    valueKeys: ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"],
    valueLabels: ["T", "R", "B", "L"],
    min: 0,
  },
  borderRadius: {
    title: "Radius",
    type: ControlType.FusedNumber,
    toggleKey: "isMixedBorderRadius",
    toggleTitles: ["Radius", "Radius per corner"],
    valueKeys: [
      "topLeftRadius",
      "topRightRadius",
      "bottomRightRadius",
      "bottomLeftRadius",
    ],
    valueLabels: ["TL", "TR", "BR", "BL"],
    min: 0,
    defaultValue: 50,
  },
});
export const __FramerMetadata__ = {
  exports: {
    default: {
      type: "reactComponent",
      name: "Clipboard",
      slots: [],
      annotations: { framerContractVersion: "1" },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
//# sourceMappingURL=./Clipboard.map
