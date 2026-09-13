import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import {
  startTransition,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { addPropertyControls, ControlType } from "framer";
const STORAGE_KEY = "framer-theme-mode";
const MANAGED_STYLE_ID = "theme-switcher-token-overrides";
const INTRO_STYLE_ID = "theme-switcher-intro-keyframes";
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
function toMode(value) {
  const lowered = String(value).toLowerCase();
  if (lowered === "light" || lowered === "dark" || lowered === "system")
    return lowered;
  return "system";
}
function getVisibleFallbackMode(initialTheme, showSystem) {
  const initialMode = toMode(initialTheme);
  if (!showSystem && initialMode === "system") return "light";
  return initialMode;
}
function getSystemTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}
function readStoredMode() {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (value === "light" || value === "dark" || value === "system")
      return value;
    return null;
  } catch {
    return null;
  }
}
function writeStoredMode(mode) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // no-op
  }
}
function removeStoredMode() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // no-op
  }
}
function extractTokensFromRuleStyle(style) {
  const tokens = {};
  for (let i = 0; i < style.length; i++) {
    const prop = style[i];
    if (!prop || !prop.startsWith("--")) continue;
    const value = style.getPropertyValue(prop).trim();
    if (!value) continue;
    tokens[prop] = value;
  }
  return tokens;
}
function mergeTokens(target, source) {
  Object.keys(source).forEach((key) => {
    if (!(key in target)) target[key] = source[key];
  });
}
function collectThemeTokens() {
  const light = {};
  const dark = {};
  if (typeof document === "undefined") return { light, dark };
  const addFromRule = (rule) => {
    if (!(rule instanceof CSSStyleRule)) return;
    const selector = rule.selectorText?.toLowerCase() ?? "";
    const tokens = extractTokensFromRuleStyle(rule.style);
    if (Object.keys(tokens).length === 0) return;
    const isDark =
      selector.includes(".dark") ||
      selector.includes('[data-framer-theme="dark"]') ||
      selector.includes('[toggle-theme="dark"]') ||
      selector.includes(":root.dark");
    const isLight =
      selector.includes('[data-framer-theme="light"]') ||
      selector.includes('[toggle-theme="light"]') ||
      selector.includes(":root") ||
      selector.includes("html") ||
      selector.includes("body");
    if (isDark) mergeTokens(dark, tokens);
    else if (isLight) mergeTokens(light, tokens);
  };
  const walkRules = (rules) => {
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      if (rule instanceof CSSMediaRule) {
        const media = rule.conditionText?.toLowerCase() ?? "";
        if (media.includes("prefers-color-scheme: dark")) {
          for (let j = 0; j < rule.cssRules.length; j++) {
            const nested = rule.cssRules[j];
            if (nested instanceof CSSStyleRule) {
              const tokens = extractTokensFromRuleStyle(nested.style);
              mergeTokens(dark, tokens);
            }
          }
        } else {
          walkRules(rule.cssRules);
        }
      } else {
        addFromRule(rule);
      }
    }
  };
  for (let i = 0; i < document.styleSheets.length; i++) {
    const sheet = document.styleSheets[i];
    try {
      if (sheet.cssRules) walkRules(sheet.cssRules);
    } catch {
      // Cross-origin or restricted stylesheet; ignore safely.
    }
  }
  return { light, dark };
}
function tokenMapToCss(tokens) {
  return Object.entries(tokens)
    .map(([key, value]) => `${key}: ${value};`)
    .join(" ");
}
function ensureTokenOverrideStyle() {
  if (typeof document === "undefined") return;
  const existing = document.getElementById(MANAGED_STYLE_ID);
  if (existing) return;
  const { light, dark } = collectThemeTokens();
  if (Object.keys(light).length === 0 && Object.keys(dark).length === 0) return;
  const styleEl = document.createElement("style");
  styleEl.id = MANAGED_STYLE_ID;
  styleEl.setAttribute("data-managed-by", "ThemeSwitcher");
  styleEl.textContent = `
body[toggle-theme="light"] { ${tokenMapToCss(light)} }
body[toggle-theme="dark"] { ${tokenMapToCss(dark)} }
    `.trim();
  document.head.appendChild(styleEl);
}
function ensureIntroKeyframesStyle() {
  if (typeof document === "undefined") return;
  const existing = document.getElementById(INTRO_STYLE_ID);
  if (existing) return;
  const styleEl = document.createElement("style");
  styleEl.id = INTRO_STYLE_ID;
  styleEl.setAttribute("data-managed-by", "ThemeSwitcher");
  styleEl.textContent = `
@keyframes themeSwitcherLabelIntro {
  from { transform: translateY(20px); }
  to { transform: translateY(0px); }
}
@keyframes themeSwitcherIndicatorIntro {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0px); opacity: 1; }
}
    `.trim();
  document.head.appendChild(styleEl);
}
function getOffsetWithinAncestor(element, ancestor) {
  let x = 0;
  let y = 0;
  let current = element;
  while (current && current !== ancestor) {
    x += current.offsetLeft;
    y += current.offsetTop;
    current = current.offsetParent;
  }
  return { x, y };
}
function applyTheme(mode, resolvedTheme, dispatchEvents = true) {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  const body = document.body;
  if (!html || !body) return;
  ensureTokenOverrideStyle();
  html.setAttribute("data-framer-theme", resolvedTheme);
  body.setAttribute("data-framer-theme", resolvedTheme);
  html.setAttribute("toggle-theme", resolvedTheme);
  body.setAttribute("toggle-theme", resolvedTheme);
  html.style.colorScheme = resolvedTheme;
  body.style.colorScheme = resolvedTheme;
  if (resolvedTheme === "dark") {
    html.classList.add("dark");
    body.classList.add("dark");
  } else {
    html.classList.remove("dark");
    body.classList.remove("dark");
  }
  if (dispatchEvents && typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("themechange", { detail: { mode, resolvedTheme } })
    );
    window.dispatchEvent(new Event("themeChange"));
  }
}
function bootstrapThemeFromStorage() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const stored = readStoredMode();
  if (!stored) return;
  const resolvedTheme = stored === "system" ? getSystemTheme() : stored;
  applyTheme(stored, resolvedTheme, false);
}
bootstrapThemeFromStorage();
/**
 * @framerDisableUnlink
 *
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */ export default function ThemeSwitcher(props) {
  const {
    initialTheme,
    rememberChoice,
    showSystem,
    lightLabel,
    darkLabel,
    systemLabel,
    font,
    gap,
    textColor,
    activeTextColor,
    hoverTextColor,
    showSelectedIndicator,
    indicatorPosition,
    indicatorGap,
    alignment,
  } = props;
  const [mode, setMode] = useState(() => toMode(initialTheme));
  const [systemTheme, setSystemTheme] = useState(() => getSystemTheme());
  const hasHandledInitialPersistence = useRef(false);
  const containerRef = useRef(null);
  const indicatorAnchorRefs = useRef({});
  const [indicatorPositionPx, setIndicatorPositionPx] = useState({
    x: 0,
    y: 0,
    ready: false,
  });
  const [indicatorShouldAnimate, setIndicatorShouldAnimate] = useState(false);
  const [componentVisible, setComponentVisible] = useState(
    () => typeof window === "undefined" || !showSelectedIndicator
  );
  const [introPhase, setIntroPhase] = useState("idle");
  const hasIndicatorInitialPlacement = useRef(false);
  const shouldAnimateNextIndicatorMove = useRef(false);
  const indicatorRevealTimeoutRef = useRef(null);
  const introStartedRef = useRef(false);
  const introRafOneRef = useRef(null);
  const introRafTwoRef = useRef(null);
  const introDoneTimeoutRef = useRef(null); // For guaranteed first-load theming, place this component as early as possible or use site-level head code.
  // This component applies the theme at the earliest practical runtime point available to a code component.
  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined") return;
    ensureIntroKeyframesStyle();
    introStartedRef.current = false;
    if (introRafOneRef.current !== null) {
      window.cancelAnimationFrame(introRafOneRef.current);
      introRafOneRef.current = null;
    }
    if (introRafTwoRef.current !== null) {
      window.cancelAnimationFrame(introRafTwoRef.current);
      introRafTwoRef.current = null;
    }
    if (introDoneTimeoutRef.current !== null) {
      window.clearTimeout(introDoneTimeoutRef.current);
      introDoneTimeoutRef.current = null;
    }
    startTransition(() => setIntroPhase("idle"));
  }, []);
  const resolvedTheme = useMemo(() => {
    if (mode === "system") return systemTheme;
    return mode;
  }, [mode, systemTheme]);
  const setThemeMode = useCallback((nextMode) => {
    shouldAnimateNextIndicatorMove.current = true;
    startTransition(() => setMode(nextMode));
  }, []);
  const alignItems = useMemo(() => {
    if (alignment === "center") return "center";
    if (alignment === "right") return "flex-end";
    return "flex-start";
  }, [alignment]);
  const justifyContent = useMemo(() => {
    if (alignment === "center") return "center";
    if (alignment === "right") return "flex-end";
    return "flex-start";
  }, [alignment]);
  const options = useMemo(
    () => [
      { label: lightLabel, value: "light" },
      { label: darkLabel, value: "dark" },
      ...(showSystem ? [{ label: systemLabel, value: "system" }] : []),
    ],
    [lightLabel, darkLabel, systemLabel, showSystem]
  );
  const activeVisibleIndex = useMemo(() => {
    const index = options.findIndex((option) => option.value === mode);
    return index >= 0 ? index : 0;
  }, [options, mode]);
  const updateIndicatorPosition = useCallback(() => {
    if (typeof window === "undefined") return;
    const container = containerRef.current;
    if (!container) return;
    const fallbackMode = options.some((option) => option.value === mode)
      ? mode
      : options[0]?.value;
    if (!fallbackMode) return;
    const anchor = indicatorAnchorRefs.current[fallbackMode];
    if (!anchor) return;
    const localOffset = getOffsetWithinAncestor(anchor, container);
    const nextX = localOffset.x + anchor.offsetWidth / 2 - 4;
    const nextY = localOffset.y + anchor.offsetHeight / 2 - 4;
    if (!hasIndicatorInitialPlacement.current) {
      hasIndicatorInitialPlacement.current = true;
      shouldAnimateNextIndicatorMove.current = false;
      startTransition(() =>
        setIndicatorPositionPx({ x: nextX, y: nextY, ready: true })
      );
      startTransition(() => setIndicatorShouldAnimate(false));
      startTransition(() => setComponentVisible(true));
      if (indicatorRevealTimeoutRef.current !== null) {
        window.clearTimeout(indicatorRevealTimeoutRef.current);
      }
      return;
    }
    const animateThisMove = shouldAnimateNextIndicatorMove.current;
    shouldAnimateNextIndicatorMove.current = false;
    startTransition(() => setIndicatorShouldAnimate(animateThisMove));
    startTransition(() =>
      setIndicatorPositionPx({ x: nextX, y: nextY, ready: true })
    );
  }, [mode, options]);
  useIsomorphicLayoutEffect(() => {
    const initialMode = getVisibleFallbackMode(initialTheme, showSystem);
    if (rememberChoice) {
      const stored = readStoredMode();
      const isStoredValidMode =
        stored === "light" ||
        stored === "dark" ||
        (showSystem && stored === "system");
      const nextMode = isStoredValidMode && stored ? stored : initialMode;
      startTransition(() => setMode(nextMode));
      return;
    }
    removeStoredMode();
    startTransition(() => setMode(initialMode));
  }, [initialTheme, rememberChoice, showSystem]);
  useEffect(() => {
    if (showSystem || mode !== "system") return;
    const fallbackMode = getVisibleFallbackMode(initialTheme, showSystem);
    startTransition(() => setMode(fallbackMode));
  }, [showSystem, mode, initialTheme]);
  useEffect(() => {
    if (!hasHandledInitialPersistence.current) {
      hasHandledInitialPersistence.current = true;
      return;
    }
    if (rememberChoice) writeStoredMode(mode);
    else removeStoredMode();
  }, [mode, rememberChoice]);
  useIsomorphicLayoutEffect(() => {
    applyTheme(mode, resolvedTheme);
  }, [mode, resolvedTheme]);
  useIsomorphicLayoutEffect(() => {
    updateIndicatorPosition();
  }, [
    updateIndicatorPosition,
    indicatorPosition,
    indicatorGap,
    alignment,
    showSystem,
    lightLabel,
    darkLabel,
    systemLabel,
  ]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (componentVisible || !showSelectedIndicator) return;
    indicatorRevealTimeoutRef.current = window.setTimeout(() => {
      startTransition(() => setComponentVisible(true));
    }, 500);
    return () => {
      if (indicatorRevealTimeoutRef.current !== null) {
        window.clearTimeout(indicatorRevealTimeoutRef.current);
      }
    };
  }, [componentVisible, showSelectedIndicator]);
  useEffect(() => {
    if (!showSelectedIndicator) {
      startTransition(() => setComponentVisible(true));
    }
  }, [showSelectedIndicator]);
  useEffect(() => {
    if (introStartedRef.current) return;
    if (!componentVisible) return;
    if (typeof window === "undefined") return;
    introStartedRef.current = true;
    introRafOneRef.current = window.requestAnimationFrame(() => {
      introRafTwoRef.current = window.requestAnimationFrame(() => {
        startTransition(() => setIntroPhase("running"));
        introDoneTimeoutRef.current = window.setTimeout(() => {
          startTransition(() => setIntroPhase("done"));
        }, 1e3);
      });
    });
  }, [componentVisible]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => updateIndicatorPosition();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateIndicatorPosition]);
  useEffect(() => {
    return () => {
      if (typeof window === "undefined") return;
      if (indicatorRevealTimeoutRef.current !== null) {
        window.clearTimeout(indicatorRevealTimeoutRef.current);
      }
      if (introRafOneRef.current !== null) {
        window.cancelAnimationFrame(introRafOneRef.current);
      }
      if (introRafTwoRef.current !== null) {
        window.cancelAnimationFrame(introRafTwoRef.current);
      }
      if (introDoneTimeoutRef.current !== null) {
        window.clearTimeout(introDoneTimeoutRef.current);
      }
    };
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (mode !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const next = media.matches ? "dark" : "light";
      startTransition(() => setSystemTheme(next));
    };
    handleChange();
    if (media.addEventListener) media.addEventListener("change", handleChange);
    else media.addListener(handleChange);
    return () => {
      if (media.removeEventListener)
        media.removeEventListener("change", handleChange);
      else media.removeListener(handleChange);
    };
  }, [mode]);
  return /*#__PURE__*/ _jsxs("div", {
    ref: containerRef,
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems,
      gap,
      width: "max-content",
      minWidth: "max-content",
      visibility: componentVisible ? "visible" : "hidden",
    },
    children: [
      /*#__PURE__*/ _jsx("span", {
        "aria-hidden": "true",
        style: {
          position: "absolute",
          left: 0,
          top: 0,
          width: 8,
          height: 8,
          minWidth: 8,
          minHeight: 8,
          overflow: "visible",
          opacity: showSelectedIndicator && indicatorPositionPx.ready ? 1 : 0,
          transform: `translate3d(${indicatorPositionPx.x}px, ${indicatorPositionPx.y}px, 0)`,
          transition: indicatorShouldAnimate
            ? "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 150ms ease, background-color 150ms ease"
            : "none",
          pointerEvents: "none",
        },
        children: /*#__PURE__*/ _jsx("span", {
          style: {
            display: "block",
            width: "100%",
            height: "100%",
            backgroundColor: activeTextColor,
            opacity: introPhase === "done" ? 1 : 0,
            transform:
              introPhase === "done" ? "translateY(0px)" : "translateY(20px)",
            animationName:
              introPhase === "running" ? "themeSwitcherIndicatorIntro" : "none",
            animationDuration: "0.6s",
            animationTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            animationDelay: `${(activeVisibleIndex + 1) * 100}ms`,
            animationFillMode: "forwards",
          },
        }),
      }),
      options.map((option, optionIndex) => {
        const isActive = option.value === mode;
        return /*#__PURE__*/ _jsx(
          "button",
          {
            type: "button",
            onClick: () => setThemeMode(option.value),
            "aria-pressed": isActive,
            style: {
              appearance: "none",
              background: "none",
              border: "none",
              padding: 0,
              margin: 0,
              cursor: isActive ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent,
              fontFamily: font.fontFamily,
              fontSize: font.fontSize ?? 15,
              lineHeight: font.lineHeight ?? "1.3em",
              letterSpacing: font.letterSpacing,
              fontWeight: font.fontWeight,
              fontStyle: font.fontStyle,
              color: isActive ? activeTextColor : textColor,
              textAlign: alignment,
              transition: "color 150ms ease",
            },
            onMouseEnter: (event) => {
              if (!isActive) event.currentTarget.style.color = hoverTextColor;
            },
            onMouseLeave: (event) => {
              if (!isActive) event.currentTarget.style.color = textColor;
            },
            children: /*#__PURE__*/ _jsxs("span", {
              style: {
                display: "flex",
                alignItems: "center",
                flexDirection:
                  indicatorPosition === "left" ? "row" : "row-reverse",
                gap: indicatorGap,
              },
              children: [
                /*#__PURE__*/ _jsx("span", {
                  ref: (node) => {
                    indicatorAnchorRefs.current[option.value] = node;
                  },
                  "aria-hidden": "true",
                  style: {
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 8,
                    height: font.lineHeight ?? "1.3em",
                    minWidth: 8,
                    minHeight: 8,
                    opacity: 0,
                    pointerEvents: "none",
                  },
                  children: /*#__PURE__*/ _jsx("span", {
                    style: { width: 8, height: 8, minWidth: 8, minHeight: 8 },
                  }),
                }),
                /*#__PURE__*/ _jsx("span", {
                  style: { display: "inline-block", overflow: "hidden" },
                  children: /*#__PURE__*/ _jsx("span", {
                    style: {
                      display: "inline-block",
                      transform:
                        introPhase === "done"
                          ? "translateY(0px)"
                          : "translateY(20px)",
                      animationName:
                        introPhase === "running"
                          ? "themeSwitcherLabelIntro"
                          : "none",
                      animationDuration: "0.6s",
                      animationTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                      animationDelay: `${(optionIndex + 1) * 100}ms`,
                      animationFillMode: "forwards",
                    },
                    children: option.label,
                  }),
                }),
              ],
            }),
          },
          option.value
        );
      }),
    ],
  });
}
ThemeSwitcher.displayName = "ThemeSwitcher";
addPropertyControls(ThemeSwitcher, {
  initialTheme: {
    type: ControlType.Enum,
    title: "Initial Theme",
    options: ["Light", "Dark", "System"],
    optionTitles: ["Light", "Dark", "System"],
    defaultValue: "System",
    displaySegmentedControl: true,
  },
  rememberChoice: {
    type: ControlType.Boolean,
    title: "Remember",
    defaultValue: true,
    enabledTitle: "On",
    disabledTitle: "Off",
  },
  showSystem: {
    type: ControlType.Boolean,
    title: "Show System",
    defaultValue: true,
    enabledTitle: "On",
    disabledTitle: "Off",
  },
  lightLabel: {
    type: ControlType.String,
    title: "Light Label",
    defaultValue: "Light",
  },
  darkLabel: {
    type: ControlType.String,
    title: "Dark Label",
    defaultValue: "Dark",
  },
  systemLabel: {
    type: ControlType.String,
    title: "System Label",
    defaultValue: "System",
  },
  font: {
    type: ControlType.Font,
    title: "Font",
    controls: "extended",
    defaultFontType: "sans-serif",
    defaultValue: {
      fontSize: "15px",
      variant: "Medium",
      letterSpacing: "-0.01em",
      lineHeight: "1.3em",
    },
  },
  gap: {
    type: ControlType.Number,
    title: "Gap",
    defaultValue: 8,
    min: 0,
    max: 40,
    step: 1,
    unit: "px",
  },
  textColor: {
    type: ControlType.Color,
    title: "Text",
    defaultValue: "#000000",
  },
  activeTextColor: {
    type: ControlType.Color,
    title: "Active",
    defaultValue: "#000000",
  },
  hoverTextColor: {
    type: ControlType.Color,
    title: "Hover",
    defaultValue: "#CCCCCC",
  },
  showSelectedIndicator: {
    type: ControlType.Boolean,
    title: "Indicator",
    defaultValue: true,
    enabledTitle: "On",
    disabledTitle: "Off",
  },
  indicatorPosition: {
    type: ControlType.Enum,
    title: "Indicator Side",
    options: ["left", "right"],
    optionTitles: ["Left", "Right"],
    defaultValue: "left",
    displaySegmentedControl: true,
  },
  indicatorGap: {
    type: ControlType.Number,
    title: "Indicator Gap",
    defaultValue: 8,
    min: 0,
    max: 40,
    step: 1,
    unit: "px",
  },
  alignment: {
    type: ControlType.Enum,
    title: "Align",
    options: ["left", "center", "right"],
    optionTitles: ["Left", "Center", "Right"],
    defaultValue: "left",
    displaySegmentedControl: true,
    description: "Component by Avataar Visora",
  },
});
export const __FramerMetadata__ = {
  exports: {
    default: {
      type: "reactComponent",
      name: "ThemeSwitcher",
      slots: [],
      annotations: {
        framerDisableUnlink: "*",
        framerSupportedLayoutWidth: "auto",
        framerSupportedLayoutHeight: "auto",
        framerContractVersion: "1",
      },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
//# sourceMappingURL=./ThemeSwitcher.map
