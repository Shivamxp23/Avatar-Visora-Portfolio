import { jsx as _jsx } from "react/jsx-runtime";
import { addPropertyControls, ControlType } from "framer";
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
const DIGITS = {
  0: [14, 17, 17, 17, 17, 17, 14],
  1: [2, 6, 2, 2, 2, 2, 7],
  2: [14, 17, 1, 6, 8, 16, 31],
  3: [14, 17, 1, 14, 1, 17, 14],
  4: [2, 6, 10, 18, 31, 2, 2],
  5: [31, 16, 16, 30, 1, 17, 14],
  6: [6, 8, 16, 30, 17, 17, 14],
  7: [31, 1, 2, 4, 8, 8, 8],
  8: [14, 17, 17, 14, 17, 17, 14],
  9: [14, 17, 17, 15, 1, 2, 12],
  ".": [0, 0, 0, 0, 0, 0, 1],
  ",": [0, 0, 0, 0, 0, 0, 1, 1],
  $: [4, 15, 20, 14, 5, 30, 4],
  "€": [15, 16, 30, 16, 30, 16, 15],
  "\xa3": [6, 9, 8, 30, 8, 9, 30],
  "\xa5": [17, 10, 4, 31, 4, 31, 4],
  "₹": [30, 4, 30, 4, 8, 16, 31],
  "₩": [17, 17, 21, 21, 31, 10, 10],
  "\xa2": [4, 15, 20, 20, 20, 15, 4],
  " ": [0, 0, 0, 0, 0, 0, 0],
  A: [14, 17, 17, 31, 17, 17, 17],
  B: [30, 17, 17, 30, 17, 17, 30],
  C: [15, 16, 16, 16, 16, 16, 15],
  D: [30, 17, 17, 17, 17, 17, 30],
  E: [31, 16, 16, 30, 16, 16, 31],
  F: [31, 16, 16, 30, 16, 16, 16],
  G: [15, 16, 16, 23, 17, 17, 15],
  H: [17, 17, 17, 31, 17, 17, 17],
  I: [31, 4, 4, 4, 4, 4, 31],
  J: [7, 2, 2, 2, 18, 18, 12],
  K: [17, 18, 20, 24, 20, 18, 17],
  L: [16, 16, 16, 16, 16, 16, 31],
  M: [17, 27, 21, 21, 17, 17, 17],
  N: [17, 25, 21, 19, 17, 17, 17],
  O: [14, 17, 17, 17, 17, 17, 14],
  P: [30, 17, 17, 30, 16, 16, 16],
  Q: [14, 17, 17, 17, 21, 18, 13],
  R: [30, 17, 17, 30, 20, 18, 17],
  S: [15, 16, 16, 14, 1, 1, 30],
  T: [31, 4, 4, 4, 4, 4, 4],
  U: [17, 17, 17, 17, 17, 17, 14],
  V: [17, 17, 17, 17, 10, 10, 4],
  W: [17, 17, 17, 21, 21, 21, 10],
  X: [17, 17, 10, 4, 10, 17, 17],
  Y: [17, 17, 10, 4, 4, 4, 4],
  Z: [31, 1, 2, 4, 8, 16, 31],
  "-": [0, 0, 0, 31, 0, 0, 0],
  "+": [0, 4, 4, 31, 4, 4, 0],
  "/": [1, 2, 2, 4, 8, 8, 16],
  ":": [0, 0, 1, 0, 1, 0, 0],
  "%": [25, 26, 2, 4, 8, 11, 19],
  "#": [10, 10, 31, 10, 31, 10, 10],
  "!": [1, 1, 1, 1, 1, 0, 1],
  "?": [14, 17, 1, 2, 4, 0, 4],
  "&": [12, 18, 20, 8, 21, 18, 13],
};
/**
 * @framerDisableUnlink
 *
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */ export default function PixelNumber(props) {
  const {
    value = "PIXEL 123",
    pixelSize = 24,
    color = "#000000",
    animate = true,
    duration = 0.8,
    repeat = false,
  } = props;
  const safePixelSize = Math.max(4, Math.round(pixelSize));
  const containerRef = useRef(null);
  const timeoutIdsRef = useRef([]);
  const hasPlayedRef = useRef(false);
  const [visiblePixels, setVisiblePixels] = useState(new Set());
  const characters = useMemo(() => {
    return (value || "")
      .toUpperCase()
      .split("")
      .filter((char) => DIGITS[char] !== undefined);
  }, [value]);
  const glyphHeight = 8 * safePixelSize;
  const safeDuration = Math.max(0.1, Math.min(2, duration));
  const glyphData = useMemo(() => {
    const litPixelKeys = [];
    const glyphs = characters
      .map((char, index) => {
        const rows = DIGITS[char];
        if (!rows) return null;
        const columns =
          char === "." || char === "," || char === ":" || char === "!"
            ? 1
            : char === " "
            ? 2
            : char === "1"
            ? 3
            : 5;
        const glyphWidth = columns * safePixelSize;
        const cells = rows.flatMap((rowBits, rowIndex) =>
          Array.from({ length: columns }, (_, colIndex) => {
            const bit = (rowBits >> (columns - 1 - colIndex)) & 1;
            const key = `${index}-${rowIndex}-${colIndex}`;
            const isLit = bit === 1;
            if (isLit) litPixelKeys.push(key);
            return { key, isLit };
          })
        );
        return { key: `${char}-${index}`, columns, glyphWidth, cells };
      })
      .filter(Boolean);
    return { glyphs: glyphs, litPixelKeys };
  }, [characters, safePixelSize]);
  const clearAllTimeouts = useCallback(() => {
    timeoutIdsRef.current.forEach((timeoutId) => {
      window.clearTimeout(timeoutId);
    });
    timeoutIdsRef.current = [];
  }, []);
  const startAppearAnimation = useCallback(() => {
    clearAllTimeouts();
    startTransition(() => setVisiblePixels(new Set()));
    const shuffledKeys = [...glyphData.litPixelKeys];
    for (let i = shuffledKeys.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffledKeys[i];
      shuffledKeys[i] = shuffledKeys[j];
      shuffledKeys[j] = temp;
    }
    const totalLitPixels = shuffledKeys.length;
    if (totalLitPixels === 0) return;
    shuffledKeys.forEach((pixelKey, index) => {
      const delayMs = ((index / totalLitPixels) * safeDuration * 1e3) | 0;
      const timeoutId = window.setTimeout(() => {
        startTransition(() => {
          setVisiblePixels((prev) => {
            const next = new Set(prev);
            next.add(pixelKey);
            return next;
          });
        });
      }, delayMs);
      timeoutIdsRef.current.push(timeoutId);
    });
  }, [clearAllTimeouts, glyphData.litPixelKeys, safeDuration]);
  useEffect(() => {
    hasPlayedRef.current = false;
    if (!animate) {
      clearAllTimeouts();
      startTransition(() => {
        setVisiblePixels(new Set(glyphData.litPixelKeys));
      });
      return;
    }
    startTransition(() => setVisiblePixels(new Set()));
    if (typeof window === "undefined" || !containerRef.current) return;
    const target = containerRef.current;
    if (!("IntersectionObserver" in window)) {
      startAppearAnimation();
      return () => {
        clearAllTimeouts();
      };
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!repeat && hasPlayedRef.current) return;
          startAppearAnimation();
          hasPlayedRef.current = true;
          if (!repeat) {
            observer.disconnect();
          }
        }
      });
    });
    observer.observe(target);
    return () => {
      observer.disconnect();
      clearAllTimeouts();
    };
  }, [
    animate,
    clearAllTimeouts,
    glyphData.litPixelKeys,
    startAppearAnimation,
    safeDuration,
    repeat,
  ]);
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);
  return /*#__PURE__*/ _jsx("div", {
    ref: containerRef,
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      gap: `${safePixelSize}px`,
      width: "auto",
      height: "auto",
      margin: 0,
      padding: 0,
    },
    children: glyphData.glyphs.map((glyph) =>
      /*#__PURE__*/ _jsx(
        "div",
        {
          "aria-hidden": "true",
          style: {
            width: `${glyph.glyphWidth}px`,
            height: `${glyphHeight}px`,
            display: "grid",
            gridTemplateColumns: `repeat(${glyph.columns}, ${safePixelSize}px)`,
            gridTemplateRows: `repeat(8, ${safePixelSize}px)`,
            gap: 0,
            margin: 0,
            padding: 0,
          },
          children: glyph.cells.map((cell) => {
            const isVisible = !animate
              ? cell.isLit
              : cell.isLit && visiblePixels.has(cell.key);
            return /*#__PURE__*/ _jsx(
              "div",
              {
                style: {
                  width: `${safePixelSize}px`,
                  height: `${safePixelSize}px`,
                  borderRadius: 0,
                  backgroundColor: isVisible ? color : "transparent",
                },
              },
              cell.key
            );
          }),
        },
        glyph.key
      )
    ),
  });
}
addPropertyControls(PixelNumber, {
  value: {
    type: ControlType.String,
    title: "Value",
    defaultValue: "PIXEL 123",
  },
  pixelSize: {
    type: ControlType.Number,
    title: "Pixel Size",
    defaultValue: 24,
    min: 4,
    max: 200,
    step: 1,
    unit: "px",
  },
  color: { type: ControlType.Color, title: "Color", defaultValue: "#000000" },
  animate: { type: ControlType.Boolean, title: "Animate", defaultValue: true },
  duration: {
    type: ControlType.Number,
    title: "Duration",
    defaultValue: 0.8,
    min: 0.1,
    max: 2,
    step: 0.05,
    unit: "s",
    hidden: (props) => !props.animate,
  },
  repeat: {
    type: ControlType.Boolean,
    title: "Repeat",
    defaultValue: false,
    hidden: (props) => !props.animate,
    description: "Component by Avataar Visora",
  },
});
export const __FramerMetadata__ = {
  exports: {
    default: {
      type: "reactComponent",
      name: "PixelNumber",
      slots: [],
      annotations: {
        framerSupportedLayoutWidth: "auto",
        framerSupportedLayoutHeight: "auto",
        framerDisableUnlink: "*",
        framerContractVersion: "1",
      },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
//# sourceMappingURL=./PixelNumber.map
