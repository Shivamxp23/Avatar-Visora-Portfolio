// Rolling text component with staggered letter animations on hover
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import {
  useState,
  useRef,
  startTransition,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { motion } from "framer-motion";
import { addPropertyControls, ControlType } from "framer";
/**
 * @framerDisableUnlink
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */ export default function RollingLetters(props) {
  const {
    text = "Rolling Letters",
    font,
    color,
    transition = {
      type: "tween",
      ease: [0.8, 0, 0.4, 1],
      duration: 0.4,
      delay: 0,
    },
    stagger = 0.05,
    reverse = false,
    transform = "none",
    tag = "span",
    showIcon = false,
    iconStyle = "outlined",
    iconName = "star",
    iconPosition = "before",
    iconSize = 24,
    iconGap = 8,
    verticalAlign = "center",
    enableVariableWeight = false,
    variableWeight = 400,
    enableRolling = true,
  } = props;
  const [animationKey, setAnimationKey] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoverAnimationEnabled, setHoverAnimationEnabled] = useState(true);
  const containerRef = useRef(null);
  const materialSymbolsClassName = useMemo(() => {
    switch (iconStyle) {
      case "rounded":
        return "material-symbols-rounded";
      case "sharp":
        return "material-symbols-sharp";
      case "outlined":
      default:
        return "material-symbols-outlined";
    }
  }, [iconStyle]);
  const materialSymbolsHref = useMemo(() => {
    const family =
      iconStyle === "rounded"
        ? "Material+Symbols+Rounded"
        : iconStyle === "sharp"
        ? "Material+Symbols+Sharp"
        : "Material+Symbols+Outlined";
    return `https://fonts.googleapis.com/css2?family=${family}:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200`;
  }, [iconStyle]);
  const shouldAnimate = useMemo(
    () => enableRolling && hoverAnimationEnabled,
    [enableRolling, hoverAnimationEnabled]
  );
  const handleMouseEnter = useCallback(() => {
    if (!shouldAnimate) return;
    if (!isAnimating) {
      startTransition(() => {
        setAnimationKey((prev) => prev + 1);
        setIsAnimating(true);
      });
    }
  }, [isAnimating, shouldAnimate]);
  const handleAnimationComplete = useCallback(() => {
    startTransition(() => setIsAnimating(false));
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const computeEnabled = () => window.innerWidth >= 1200;
    const apply = () => {
      const enabled = computeEnabled();
      startTransition(() => setHoverAnimationEnabled(enabled));
      if (!enabled) {
        startTransition(() => setIsAnimating(false));
      }
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);
  const letters = useMemo(() => text.split(""), [text]);
  const normalizedIconName = useMemo(() => {
    // Material Symbols ligatures use snake_case names (e.g. arrow_forward)
    return String(iconName || "")
      .trim()
      .replace(/[\s-]+/g, "_")
      .replace(/_+/g, "_")
      .toLowerCase();
  }, [iconName]);
  const lineHeightPx = useMemo(() => {
    const fontSize = font?.fontSize;
    const lineHeight = font?.lineHeight;
    if (!lineHeight) return undefined;
    const fontSizePx =
      typeof fontSize === "number"
        ? fontSize
        : typeof fontSize === "string" && fontSize.endsWith("px")
        ? parseFloat(fontSize)
        : undefined;
    if (typeof lineHeight === "number") {
      return fontSizePx != null ? lineHeight * fontSizePx : undefined;
    }
    if (typeof lineHeight === "string") {
      if (lineHeight.endsWith("px")) return parseFloat(lineHeight);
      if (lineHeight.endsWith("em")) {
        const em = parseFloat(lineHeight);
        return fontSizePx != null ? em * fontSizePx : undefined;
      }
    }
    return undefined;
  }, [font]);
  const letterSpacingPx = useMemo(() => {
    const ls = font?.letterSpacing;
    if (ls == null) return 0;
    const fontSize = font?.fontSize;
    const fontSizePx =
      typeof fontSize === "number"
        ? fontSize
        : typeof fontSize === "string" && fontSize.endsWith("px")
        ? parseFloat(fontSize)
        : undefined;
    if (typeof ls === "number") return ls;
    if (typeof ls === "string") {
      const v = parseFloat(ls);
      if (Number.isNaN(v)) return 0;
      if (ls.endsWith("px")) return v;
      if (ls.endsWith("em")) return fontSizePx != null ? v * fontSizePx : 0;
    }
    return 0;
  }, [font]);
  const clipOverflowX = useMemo(() => {
    // Avoid side clipping when letterSpacing is negative by expanding the clip area horizontally.
    // Keep this conservative to avoid affecting layout.
    const extra = Math.max(0, -letterSpacingPx);
    return Math.min(64, Math.ceil(extra * 2 + 8));
  }, [letterSpacingPx]);
  const items = useMemo(() => {
    const base = letters.map((letter) => ({ type: "letter", value: letter }));
    if (!showIcon) return base;
    const iconItem = { type: "icon", value: normalizedIconName };
    return iconPosition === "before"
      ? [iconItem, ...base]
      : [...base, iconItem];
  }, [letters, showIcon, normalizedIconName, iconPosition]);
  const alignItemsValue = useMemo(() => {
    switch (verticalAlign) {
      case "top":
        return "flex-start";
      case "bottom":
        return "flex-end";
      case "baseline":
        return "baseline";
      case "center":
      default:
        return "center";
    }
  }, [verticalAlign]);
  const fontOverrides = useMemo(() => {
    if (!enableVariableWeight) return undefined;
    const w = Math.round(Math.max(1, Math.min(1e3, variableWeight)));
    const existing = font?.fontVariationSettings;
    const cleaned =
      typeof existing === "string"
        ? existing.replace(/"wght"\s*\d+/g, "").trim()
        : "";
    const merged = [cleaned, `"wght" ${w}`].filter(Boolean).join(", ");
    return { fontWeight: w, fontVariationSettings: merged };
  }, [enableVariableWeight, variableWeight, font]);
  const WrapperTag = "div";
  return /*#__PURE__*/ _jsxs(WrapperTag, {
    ref: containerRef,
    style: {
      ...props.style,
      position: "relative",
      display: "inline-block",
      userSelect: "none",
      cursor: "pointer",
      overflow: "visible",
    },
    onMouseEnter: handleMouseEnter,
    children: [
      /*#__PURE__*/ _jsx("link", {
        rel: "stylesheet",
        href: materialSymbolsHref,
      }),
      /*#__PURE__*/ _jsx("div", {
        style: {
          display: "flex",
          alignItems: alignItemsValue,
          ...font,
          ...(fontOverrides || undefined),
          color: color,
          textTransform: transform,
          margin: 0,
          padding: 0,
        },
        children: items.map((item, index) =>
          /*#__PURE__*/ _jsx(
            "div",
            {
              style: {
                position: "relative",
                display: item.type === "icon" ? "inline-flex" : "inline-block",
                alignItems: item.type === "icon" ? alignItemsValue : undefined,
                overflow: "visible",
                height:
                  item.type === "icon"
                    ? `${Math.max(iconSize, lineHeightPx ?? 0)}px`
                    : lineHeightPx != null
                    ? `${lineHeightPx}px`
                    : font?.lineHeight || "1em",
                ...(showIcon && item.type === "icon"
                  ? iconPosition === "before"
                    ? { marginRight: iconGap }
                    : { marginLeft: iconGap }
                  : undefined),
              },
              children: /*#__PURE__*/ _jsxs("div", {
                style: {
                  position: "relative",
                  height: "100%",
                  overflow: "visible",
                  clipPath: `inset(0px -${clipOverflowX}px 0px -${clipOverflowX}px)`,
                  display: item.type === "icon" ? "inline-flex" : "block",
                  alignItems:
                    item.type === "icon" ? alignItemsValue : undefined,
                },
                children: [
                  /*#__PURE__*/ _jsx(
                    motion.div,
                    {
                      style: {
                        position: "relative",
                        display:
                          item.type === "icon" ? "inline-flex" : "inline-block",
                        alignItems:
                          item.type === "icon" ? alignItemsValue : undefined,
                        height: item.type === "icon" ? "100%" : undefined,
                      },
                      initial: { y: 0 },
                      animate: {
                        y:
                          animationKey > 0 && shouldAnimate
                            ? item.type === "icon"
                              ? reverse
                                ? Math.max(iconSize, lineHeightPx ?? 0)
                                : -Math.max(iconSize, lineHeightPx ?? 0)
                              : reverse
                              ? "100%"
                              : "-100%"
                            : 0,
                      },
                      transition: { ...transition, delay: index * stagger },
                      onAnimationComplete:
                        index === items.length - 1
                          ? handleAnimationComplete
                          : undefined,
                      children:
                        item.type === "icon"
                          ? /*#__PURE__*/ _jsx("span", {
                              "aria-hidden": "true",
                              className: materialSymbolsClassName,
                              style: {
                                fontSize: iconSize,
                                lineHeight: `${iconSize}px`,
                                display: "block",
                                padding: 0,
                                margin: 0,
                              },
                              children: item.value,
                            })
                          : item.value === " "
                          ? "\xa0"
                          : item.value,
                    },
                    `original-${animationKey}`
                  ),
                  /*#__PURE__*/ _jsx(
                    motion.div,
                    {
                      style: {
                        position: "absolute",
                        top:
                          item.type === "icon"
                            ? reverse
                              ? `-${Math.max(iconSize, lineHeightPx ?? 0)}px`
                              : `${Math.max(iconSize, lineHeightPx ?? 0)}px`
                            : reverse
                            ? "-100%"
                            : "100%",
                        left: 0,
                        display:
                          item.type === "icon" ? "inline-flex" : "inline-block",
                        alignItems:
                          item.type === "icon" ? alignItemsValue : undefined,
                        height: item.type === "icon" ? "100%" : undefined,
                        opacity: enableRolling ? 1 : 0,
                      },
                      initial: { y: 0 },
                      animate: {
                        y:
                          animationKey > 0 && shouldAnimate
                            ? item.type === "icon"
                              ? reverse
                                ? Math.max(iconSize, lineHeightPx ?? 0)
                                : -Math.max(iconSize, lineHeightPx ?? 0)
                              : reverse
                              ? "100%"
                              : "-100%"
                            : 0,
                      },
                      transition: { ...transition, delay: index * stagger },
                      children:
                        item.type === "icon"
                          ? /*#__PURE__*/ _jsx("span", {
                              "aria-hidden": "true",
                              className: materialSymbolsClassName,
                              style: {
                                fontSize: iconSize,
                                lineHeight: `${iconSize}px`,
                                display: "block",
                                padding: 0,
                                margin: 0,
                              },
                              children: item.value,
                            })
                          : item.value === " "
                          ? "\xa0"
                          : item.value,
                    },
                    `rolling-${animationKey}`
                  ),
                ],
              }),
            },
            index
          )
        ),
      }),
    ],
  });
}
addPropertyControls(RollingLetters, {
  enableRolling: {
    type: ControlType.Boolean,
    title: "Rolling",
    defaultValue: true,
    enabledTitle: "On",
    disabledTitle: "Off",
  },
  text: {
    type: ControlType.String,
    title: "Text",
    defaultValue: "Rolling Letters",
  },
  font: {
    type: ControlType.Font,
    title: "Font",
    defaultValue: {
      fontSize: "32px",
      variant: "Semibold",
      letterSpacing: "-0.03em",
      lineHeight: "1em",
    },
    controls: "extended",
    defaultFontType: "sans-serif",
  },
  color: { type: ControlType.Color, title: "Color", defaultValue: "#000000" },
  transition: { type: ControlType.Transition, title: "Transition" },
  stagger: {
    type: ControlType.Number,
    title: "Stagger",
    defaultValue: 0.05,
    min: 0,
    max: 1,
    step: 0.01,
    unit: "s",
  },
  reverse: {
    type: ControlType.Boolean,
    title: "Reverse",
    defaultValue: false,
    enabledTitle: "Yes",
    disabledTitle: "No",
  },
  transform: {
    type: ControlType.Enum,
    title: "Transform",
    options: ["none", "uppercase", "lowercase", "capitalize"],
    optionTitles: ["None", "Uppercase", "Lowercase", "Capitalize"],
    defaultValue: "none",
  },
  showIcon: {
    type: ControlType.Boolean,
    title: "Icon",
    defaultValue: false,
    enabledTitle: "Show",
    disabledTitle: "Hide",
  },
  iconStyle: {
    type: ControlType.Enum,
    title: "Collection",
    options: ["outlined", "rounded", "sharp"],
    optionTitles: ["Outlined", "Rounded", "Sharp"],
    defaultValue: "outlined",
    hidden: ({ showIcon }) => !showIcon,
  },
  iconName: {
    type: ControlType.String,
    title: "Icon Name",
    description: "Material Symbols icon name from Google.",
    defaultValue: "star",
    hidden: ({ showIcon }) => !showIcon,
  },
  iconPosition: {
    type: ControlType.Enum,
    title: "Icon Position",
    options: ["before", "after"],
    optionTitles: ["Before", "After"],
    defaultValue: "before",
    displaySegmentedControl: true,
    hidden: ({ showIcon }) => !showIcon,
  },
  iconSize: {
    type: ControlType.Number,
    title: "Icon Size",
    defaultValue: 24,
    min: 8,
    max: 200,
    step: 1,
    unit: "px",
    hidden: ({ showIcon }) => !showIcon,
  },
  iconGap: {
    type: ControlType.Number,
    title: "Icon Gap",
    defaultValue: 8,
    min: 0,
    max: 64,
    step: 1,
    unit: "px",
    hidden: ({ showIcon }) => !showIcon,
  },
  verticalAlign: {
    type: ControlType.Enum,
    title: "Align",
    options: ["center", "baseline", "top", "bottom"],
    optionTitles: ["Center", "Baseline", "Top", "Bottom"],
    defaultValue: "center",
  },
  enableVariableWeight: {
    type: ControlType.Boolean,
    title: "Variable Weight",
    defaultValue: false,
    enabledTitle: "On",
    disabledTitle: "Off",
  },
  variableWeight: {
    type: ControlType.Number,
    title: "Weight",
    defaultValue: 400,
    min: 1,
    max: 1e3,
    step: 1,
    hidden: ({ enableVariableWeight }) => !enableVariableWeight,
  },
  tag: {
    type: ControlType.Enum,
    title: "Tag",
    options: ["p", "span", "h1", "h2", "h3", "h4", "h5", "h6"],
    optionTitles: ["P", "Span", "H1", "H2", "H3", "H4", "H5", "H6"],
    defaultValue: "span",
    description: "Component by Avataar Visora",
  },
});
export const __FramerMetadata__ = {
  exports: {
    default: {
      type: "reactComponent",
      name: "RollingLetters",
      slots: [],
      annotations: {
        framerDisableUnlink: "* @framerSupportedLayoutWidth auto",
        framerSupportedLayoutHeight: "auto",
        framerContractVersion: "1",
      },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
//# sourceMappingURL=./RollingLetters.map
