import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import {
  addPropertyControls,
  ControlType,
  useIsStaticRenderer,
  useObserveData,
} from "framer";
import { useInView } from "framer-motion";
function drawImageCover(context, image, width, height) {
  const sourceWidth = Math.max(1, image.naturalWidth || image.width || 1);
  const sourceHeight = Math.max(1, image.naturalHeight || image.height || 1);
  const scale = Math.max(width / sourceWidth, height / sourceHeight);
  const drawnWidth = sourceWidth * scale;
  const drawnHeight = sourceHeight * scale;
  const x = (width - drawnWidth) / 2;
  const y = (height - drawnHeight) / 2;
  context.drawImage(image, x, y, drawnWidth, drawnHeight);
}
function createPixelCells(width, height, pixelsPerRow) {
  const safeWidth = Math.max(1, Math.round(width));
  const safeHeight = Math.max(1, Math.round(height));
  const requestedColumns = Math.max(1, Math.round(pixelsPerRow));
  const columns = Math.max(1, Math.min(requestedColumns, safeWidth));
  const cellSize = safeWidth / columns;
  const rows = Math.max(
    1,
    Math.min(safeHeight, Math.ceil(safeHeight / Math.max(1, cellSize)))
  );
  const zones = [];
  for (let row = 0; row < rows; row++) {
    const y0 = Math.round(row * cellSize);
    const y1 =
      row === rows - 1
        ? safeHeight
        : Math.round(Math.min(safeHeight, (row + 1) * cellSize));
    if (y0 >= safeHeight) break;
    for (let column = 0; column < columns; column++) {
      const x0 = Math.round((column * safeWidth) / columns);
      const x1 =
        column === columns - 1
          ? safeWidth
          : Math.round(((column + 1) * safeWidth) / columns);
      const x = Math.max(0, Math.min(safeWidth, x0));
      const y = Math.max(0, Math.min(safeHeight, y0));
      const cellWidth = Math.max(1, Math.min(safeWidth, x1) - x);
      const cellHeight = Math.max(1, Math.min(safeHeight, y1) - y);
      zones.push({
        x,
        y,
        width: Math.min(cellWidth, safeWidth - x),
        height: Math.min(cellHeight, safeHeight - y),
      });
    }
  }
  return { zones, columns, rows, cellSize };
}
function findPixelCellAtPoint(zones, point) {
  for (let index = 0; index < zones.length; index++) {
    const zone = zones[index];
    if (
      point.x >= zone.x &&
      point.x < zone.x + zone.width &&
      point.y >= zone.y &&
      point.y < zone.y + zone.height
    ) {
      return index;
    }
  }
  return -1;
}
function getCanvasPixelSize(width, height) {
  const dpr =
    typeof window === "undefined"
      ? 1
      : Math.max(1, Math.round((window.devicePixelRatio || 1) * 1e3) / 1e3);
  return {
    dpr,
    width: Math.max(1, Math.round(Math.max(1, width) * dpr)),
    height: Math.max(1, Math.round(Math.max(1, height) * dpr)),
  };
}
function createRevealOrderIndex(count, seed) {
  const indices = Array.from({ length: count }, (_, index) => index);
  let state = Math.max(1, Math.floor(seed));
  const random = () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
  for (let index = indices.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(random() * (index + 1));
    const current = indices[index];
    indices[index] = indices[swapIndex];
    indices[swapIndex] = current;
  }
  const orderIndex = new Array(count);
  for (let position = 0; position < count; position++) {
    orderIndex[indices[position]] = position;
  }
  return orderIndex;
}
/**
 * PixelHover
 * @framerDisableUnlink
 *
 * @framerIntrinsicWidth 320
 * @framerIntrinsicHeight 220
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */ export default function PixelHover(props) {
  const {
    image = {
      src: "https://framerusercontent.com/images/GfGkADagM4KEibNcIiRUWlfrR0.jpg",
      alt: "Uploaded image",
    },
    mode = "normal",
    colorFill = false,
    fillColor = "#000000",
    pixelsPerRow = 24,
    delay = 600,
    introAnimation = true,
    smoothness = 1.7,
    revealDuration = 1.2,
    inViewAmount = 0.25,
    once = true,
    style,
  } = props;
  const isReverse = mode === "normal";
  const containerRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const baseCanvasRef = React.useRef(null);
  const introCanvasRef = React.useRef(null);
  const introSourceCanvasRef = React.useRef(null);
  const sourceImageRef = React.useRef(null);
  const pixelGridRef = React.useRef(null);
  const activeCellsRef = React.useRef(new Map());
  const animationFrameRef = React.useRef(null);
  const introAnimationFrameRef = React.useRef(null);
  const introOrderIndexRef = React.useRef([]);
  const introProgressRef = React.useRef(0);
  const previousIntroInViewRef = React.useRef(false);
  const [size, setSize] = React.useState({ width: 1, height: 1 });
  const [mediaAspectRatio, setMediaAspectRatio] = React.useState(320 / 220);
  const [themeVersion, setThemeVersion] = React.useState(0);
  const [pixelGridVersion, setPixelGridVersion] = React.useState(0);
  const [introComplete, setIntroComplete] = React.useState(false);
  const isStatic = useIsStaticRenderer();
  const observedData = useObserveData();
  const isWidthFill = style?.width === "100%";
  const isHeightFill = style?.height === "100%";
  const shouldRunIntro = introAnimation && !isStatic;
  const contentVisible = !shouldRunIntro || introComplete || isStatic;
  const clampedInViewAmount = Math.max(0, Math.min(1, inViewAmount));
  const inView = useInView(containerRef, { amount: clampedInViewAmount, once });
  const anyVisible = useInView(containerRef, { amount: 0, once: false });
  React.useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined")
      return;
    let frame = null;
    const bumpThemeVersion = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        setThemeVersion((version) => version + 1);
      });
    };
    const observer = new MutationObserver(bumpThemeVersion);
    const options = {
      attributes: true,
      attributeFilter: [
        "class",
        "style",
        "data-framer-theme",
        "data-theme",
        "data-mode",
        "data-color-mode",
      ],
    };
    const observed = new Set();
    const observe = (element) => {
      if (!element || observed.has(element)) return;
      observed.add(element);
      observer.observe(element, options);
    };
    observe(document.documentElement);
    observe(document.body);
    let current = containerRef.current;
    while (current) {
      observe(current);
      current = current.parentElement;
    }
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    media?.addEventListener?.("change", bumpThemeVersion);
    window.addEventListener("pageshow", bumpThemeVersion);
    return () => {
      observer.disconnect();
      media?.removeEventListener?.("change", bumpThemeVersion);
      window.removeEventListener("pageshow", bumpThemeVersion);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);
  const resolvedFillColor = React.useMemo(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return fillColor;
    }
    try {
      const element = document.createElement("div");
      element.style.color = fillColor;
      element.style.display = "none";
      const host =
        containerRef.current || document.body || document.documentElement;
      host.appendChild(element);
      const computed = window.getComputedStyle(element).color;
      host.removeChild(element);
      return computed || fillColor;
    } catch {
      return fillColor;
    }
  }, [fillColor, observedData, themeVersion]);
  const pixelCells = React.useMemo(
    () => createPixelCells(size.width, size.height, pixelsPerRow),
    [pixelsPerRow, size.height, size.width]
  );
  const revealZones = pixelCells.zones;
  const smoothnessActual = React.useMemo(() => {
    const value = Number.isFinite(smoothness) ? smoothness : 1.7;
    const clamped = Math.max(1, Math.min(10, value));
    return 1 + ((clamped - 1) * 39) / 9;
  }, [smoothness]);
  const clearIntroCanvas = React.useCallback(() => {
    const canvas = introCanvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
  }, []);
  const drawIntro = React.useCallback(
    (progress) => {
      if (isStatic || typeof window === "undefined") return;
      const canvas = introCanvasRef.current;
      const context = canvas?.getContext("2d");
      const pixelGrid = pixelGridRef.current;
      if (!canvas || !context || !pixelGrid) return;
      const { width: pixelWidth, height: pixelHeight } = getCanvasPixelSize(
        size.width,
        size.height
      );
      if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
      if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, pixelWidth, pixelHeight);
      let sourceCanvas = pixelGrid.pixelatedCanvas;
      if (isReverse) {
        sourceCanvas = pixelGrid.pixelatedCanvas;
        context.imageSmoothingEnabled = false;
      } else if (sourceImageRef.current) {
        if (!introSourceCanvasRef.current) {
          introSourceCanvasRef.current = document.createElement("canvas");
        }
        const introSourceCanvas = introSourceCanvasRef.current;
        if (introSourceCanvas.width !== pixelWidth) {
          introSourceCanvas.width = pixelWidth;
        }
        if (introSourceCanvas.height !== pixelHeight) {
          introSourceCanvas.height = pixelHeight;
        }
        const introSourceContext = introSourceCanvas.getContext("2d");
        if (!introSourceContext) return;
        introSourceContext.setTransform(1, 0, 0, 1, 0, 0);
        introSourceContext.clearRect(0, 0, pixelWidth, pixelHeight);
        introSourceContext.imageSmoothingEnabled = true;
        introSourceContext.imageSmoothingQuality = "high";
        drawImageCover(
          introSourceContext,
          sourceImageRef.current,
          pixelWidth,
          pixelHeight
        );
        sourceCanvas = introSourceCanvas;
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
      } else {
        sourceCanvas = pixelGrid.normalCanvas;
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
      }
      const orderIndex = introOrderIndexRef.current;
      const total = revealZones.length || 1;
      const globalT = progress * (total - 1 + smoothnessActual);
      for (let index = 0; index < revealZones.length; index++) {
        const orderPosition = orderIndex[index] ?? index;
        const opacity = Math.max(
          0,
          Math.min(1, (globalT - orderPosition) / smoothnessActual)
        );
        if (opacity <= 0) continue;
        const zone = pixelGrid.drawZones[index];
        if (!zone) continue;
        context.globalAlpha = opacity;
        context.drawImage(
          sourceCanvas,
          zone.x,
          zone.y,
          zone.width,
          zone.height,
          zone.x,
          zone.y,
          zone.width,
          zone.height
        );
      }
      context.globalAlpha = 1;
    },
    [
      isReverse,
      isStatic,
      revealZones,
      size.height,
      size.width,
      smoothnessActual,
    ]
  );
  const drawBase = React.useCallback(() => {
    const canvas = baseCanvasRef.current;
    const context = canvas?.getContext("2d");
    const pixelGrid = pixelGridRef.current;
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (isReverse && pixelGrid) {
      context.drawImage(pixelGrid.pixelatedCanvas, 0, 0);
    }
  }, [isReverse]);
  const drawActiveCells = React.useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const pixelGrid = pixelGridRef.current;
    if (!canvas || !context || !pixelGrid) return;
    const now = performance.now();
    const sourceCanvas = isReverse
      ? pixelGrid.normalCanvas
      : pixelGrid.pixelatedCanvas;
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (const [key, expiresAt] of activeCellsRef.current) {
      if (expiresAt <= now) {
        activeCellsRef.current.delete(key);
        continue;
      }
      const zone = pixelGrid.drawZones[Number(key)];
      if (!zone) continue;
      context.drawImage(
        sourceCanvas,
        zone.x,
        zone.y,
        zone.width,
        zone.height,
        zone.x,
        zone.y,
        zone.width,
        zone.height
      );
    }
    if (activeCellsRef.current.size > 0) {
      animationFrameRef.current = window.requestAnimationFrame(drawActiveCells);
    } else {
      animationFrameRef.current = null;
    }
  }, [isReverse]);
  const requestDraw = React.useCallback(() => {
    if (animationFrameRef.current !== null) return;
    animationFrameRef.current = window.requestAnimationFrame(drawActiveCells);
  }, [drawActiveCells]);
  const clearActiveCells = React.useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    activeCellsRef.current.clear();
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);
  React.useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const updateSize = () => {
      setSize({
        width: Math.max(1, Math.round(element.clientWidth)),
        height: Math.max(1, Math.round(element.clientHeight)),
      });
    };
    updateSize();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }
    const observer = new ResizeObserver(updateSize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  React.useEffect(() => {
    const activeCanvas = canvasRef.current;
    const baseCanvas = baseCanvasRef.current;
    const canvasSize = getCanvasPixelSize(size.width, size.height);
    if (activeCanvas) {
      activeCanvas.width = canvasSize.width;
      activeCanvas.height = canvasSize.height;
    }
    if (baseCanvas) {
      baseCanvas.width = canvasSize.width;
      baseCanvas.height = canvasSize.height;
    }
    clearActiveCells();
    clearIntroCanvas();
    drawBase();
  }, [clearActiveCells, clearIntroCanvas, drawBase, size.width, size.height]);
  React.useEffect(() => {
    const source = image?.src;
    const width = size.width;
    const height = size.height;
    pixelGridRef.current = null;
    sourceImageRef.current = null;
    clearActiveCells();
    clearIntroCanvas();
    setIntroComplete(!introAnimation || isStatic);
    drawBase();
    if (!source || width <= 0 || height <= 0) return;
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;
      sourceImageRef.current = img;
      const naturalWidth = img.naturalWidth || img.width;
      const naturalHeight = img.naturalHeight || img.height;
      if (naturalWidth > 0 && naturalHeight > 0) {
        setMediaAspectRatio(naturalWidth / naturalHeight);
      }
      const cssCells = createPixelCells(width, height, pixelsPerRow);
      const canvasSize = getCanvasPixelSize(width, height);
      const drawCells = createPixelCells(
        canvasSize.width,
        canvasSize.height,
        pixelsPerRow
      );
      const { zones, columns, rows, cellSize } = cssCells;
      const drawZones = drawCells.zones;
      const normalCanvas = document.createElement("canvas");
      normalCanvas.width = canvasSize.width;
      normalCanvas.height = canvasSize.height;
      const normalContext = normalCanvas.getContext("2d");
      if (!normalContext) return;
      normalContext.clearRect(0, 0, normalCanvas.width, normalCanvas.height);
      drawImageCover(
        normalContext,
        img,
        normalCanvas.width,
        normalCanvas.height
      );
      const lowResCanvas = document.createElement("canvas");
      lowResCanvas.width = drawCells.columns;
      lowResCanvas.height = drawCells.rows;
      const lowResContext = lowResCanvas.getContext("2d");
      if (!lowResContext) return;
      lowResContext.imageSmoothingEnabled = true;
      lowResContext.clearRect(0, 0, lowResCanvas.width, lowResCanvas.height);
      drawImageCover(
        lowResContext,
        img,
        lowResCanvas.width,
        lowResCanvas.height
      );
      const pixelatedCanvas = document.createElement("canvas");
      pixelatedCanvas.width = canvasSize.width;
      pixelatedCanvas.height = canvasSize.height;
      const pixelatedContext = pixelatedCanvas.getContext("2d");
      if (!pixelatedContext) return;
      pixelatedContext.imageSmoothingEnabled = false;
      pixelatedContext.clearRect(
        0,
        0,
        pixelatedCanvas.width,
        pixelatedCanvas.height
      );
      if (colorFill) {
        pixelatedContext.fillStyle = resolvedFillColor;
        pixelatedContext.fillRect(
          0,
          0,
          pixelatedCanvas.width,
          pixelatedCanvas.height
        );
      } else {
        for (let index = 0; index < drawZones.length; index++) {
          const zone = drawZones[index];
          const column = index % drawCells.columns;
          const row = Math.floor(index / drawCells.columns);
          pixelatedContext.drawImage(
            lowResCanvas,
            column,
            row,
            1,
            1,
            zone.x,
            zone.y,
            zone.width,
            zone.height
          );
        }
      }
      pixelGridRef.current = {
        pixelatedCanvas,
        normalCanvas,
        columns,
        rows,
        cellSize,
        zones,
        drawZones,
      };
      setPixelGridVersion((version) => version + 1);
      drawBase();
    };
    img.src = source;
    return () => {
      cancelled = true;
    };
  }, [
    clearActiveCells,
    colorFill,
    drawBase,
    fillColor,
    resolvedFillColor,
    observedData,
    image?.src,
    pixelsPerRow,
    size.width,
    size.height,
    introAnimation,
    isStatic,
  ]);
  React.useEffect(() => {
    clearActiveCells();
    drawBase();
  }, [clearActiveCells, drawBase, isReverse]);
  React.useEffect(() => {
    if (!introAnimation || isStatic || typeof window === "undefined") {
      setIntroComplete(true);
      clearIntroCanvas();
      return;
    }
    const cancelIntro = () => {
      if (introAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(introAnimationFrameRef.current);
        introAnimationFrameRef.current = null;
      }
    };
    if (!once && !anyVisible) {
      cancelIntro();
      previousIntroInViewRef.current = false;
      introProgressRef.current = 0;
      setIntroComplete(false);
      clearIntroCanvas();
      return;
    }
    if (!inView) {
      previousIntroInViewRef.current = false;
      return cancelIntro;
    }
    if (!pixelGridRef.current) return cancelIntro;
    if (introComplete && previousIntroInViewRef.current) return cancelIntro;
    previousIntroInViewRef.current = true;
    introOrderIndexRef.current = createRevealOrderIndex(
      revealZones.length,
      (Date.now() + Math.floor(Math.random() * 1e6)) % 2147483647
    );
    introProgressRef.current = 0;
    setIntroComplete(false);
    drawIntro(0);
    const startTime = performance.now();
    const durationMs = Math.max(0.001, revealDuration) * 1e3;
    const tick = (now) => {
      const progress = Math.max(0, Math.min(1, (now - startTime) / durationMs));
      introProgressRef.current = progress;
      drawIntro(progress);
      if (progress < 1) {
        introAnimationFrameRef.current = window.requestAnimationFrame(tick);
      } else {
        introAnimationFrameRef.current = null;
        drawIntro(1);
        setIntroComplete(true);
      }
    };
    cancelIntro();
    introAnimationFrameRef.current = window.requestAnimationFrame(tick);
    return cancelIntro;
  }, [
    anyVisible,
    clearIntroCanvas,
    drawIntro,
    inView,
    introAnimation,
    introComplete,
    isStatic,
    once,
    pixelGridVersion,
    revealDuration,
    revealZones.length,
  ]);
  React.useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      if (introAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(introAnimationFrameRef.current);
      }
    };
  }, []);
  const activateCells = (point) => {
    const pixelGrid = pixelGridRef.current;
    if (!pixelGrid) return;
    const cellIndex = findPixelCellAtPoint(pixelGrid.zones, point);
    if (cellIndex < 0) return;
    const delayMs = Math.max(0, delay);
    const expiresAt = performance.now() + delayMs;
    activeCellsRef.current.set(String(cellIndex), expiresAt);
    requestDraw();
  };
  const getPointerPoint = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
  };
  const handlePointer = (event) => {
    activateCells(getPointerPoint(event));
  };
  return /*#__PURE__*/ _jsxs("div", {
    ref: containerRef,
    style: {
      position: "relative",
      width: "100%",
      height: "100%",
      minWidth: 1,
      minHeight: 1,
      overflow: "hidden",
      ...style,
    },
    onPointerEnter: handlePointer,
    onPointerMove: handlePointer,
    children: [
      (!isWidthFill || !isHeightFill) &&
        /*#__PURE__*/ _jsx("img", {
          src: image?.src,
          srcSet: image?.srcSet,
          alt: "",
          "aria-hidden": "true",
          draggable: false,
          style: {
            display: "block",
            width: isWidthFill ? "100%" : isHeightFill ? "auto" : 320,
            height: isHeightFill
              ? "100%"
              : isWidthFill
              ? "auto"
              : 320 / mediaAspectRatio,
            aspectRatio: mediaAspectRatio,
            opacity: 0,
            pointerEvents: "none",
            userSelect: "none",
          },
        }),
      /*#__PURE__*/ _jsxs("div", {
        style: {
          position: "absolute",
          inset: 0,
          opacity: contentVisible ? 1 : 0,
          pointerEvents: contentVisible ? "auto" : "none",
        },
        children: [
          /*#__PURE__*/ _jsx("img", {
            src: image?.src,
            srcSet: image?.srcSet,
            alt: (image?.alt || "").trim(),
            style: {
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              opacity: isReverse ? 0 : 1,
              userSelect: "none",
            },
            draggable: false,
          }),
          /*#__PURE__*/ _jsx("canvas", {
            ref: baseCanvasRef,
            "aria-hidden": "true",
            style: {
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            },
          }),
          /*#__PURE__*/ _jsx("canvas", {
            ref: canvasRef,
            "aria-hidden": "true",
            style: {
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            },
          }),
        ],
      }),
      shouldRunIntro &&
        !introComplete &&
        /*#__PURE__*/ _jsx("canvas", {
          ref: introCanvasRef,
          "aria-hidden": "true",
          style: {
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "block",
            pointerEvents: "none",
          },
        }),
    ],
  });
}
addPropertyControls(PixelHover, {
  image: { type: ControlType.ResponsiveImage, title: "Image" },
  mode: {
    type: ControlType.Enum,
    title: "Mode",
    defaultValue: "normal",
    options: ["normal", "reverse"],
    optionTitles: ["Normal", "Reverse"],
    displaySegmentedControl: true,
  },
  colorFill: {
    type: ControlType.Boolean,
    title: "Color Fill",
    defaultValue: false,
  },
  fillColor: {
    type: ControlType.Color,
    title: "Pixel Color",
    defaultValue: "#000000",
    hidden: (props) => !props.colorFill,
  },
  pixelsPerRow: {
    type: ControlType.Number,
    title: "Pixels / Row",
    defaultValue: 24,
    min: 2,
    max: 160,
    step: 1,
    displayStepper: true,
  },
  delay: {
    type: ControlType.Number,
    title: "Delay",
    defaultValue: 600,
    min: 0,
    max: 2e3,
    step: 50,
    unit: "ms",
  },
  introAnimation: {
    type: ControlType.Boolean,
    title: "Intro Animation",
    defaultValue: true,
    enabledTitle: "On",
    disabledTitle: "Off",
  },
  smoothness: {
    type: ControlType.Number,
    title: "Smoothness",
    defaultValue: 1.7,
    min: 1,
    max: 10,
    step: 0.1,
    hidden: (props) => !props.introAnimation,
  },
  revealDuration: {
    type: ControlType.Number,
    title: "Reveal Duration",
    defaultValue: 1.2,
    min: 0.05,
    max: 10,
    step: 0.05,
    unit: "s",
    hidden: (props) => !props.introAnimation,
  },
  inViewAmount: {
    type: ControlType.Number,
    title: "In-view Amount",
    defaultValue: 0.25,
    min: 0,
    max: 1,
    step: 0.05,
    hidden: (props) => !props.introAnimation,
  },
  once: {
    type: ControlType.Boolean,
    title: "Once",
    defaultValue: true,
    enabledTitle: "Yes",
    disabledTitle: "No",
    hidden: (props) => !props.introAnimation,
    description: "Component by Avataar Visora",
  },
});
export const __FramerMetadata__ = {
  exports: {
    default: {
      type: "reactComponent",
      name: "PixelHover",
      slots: [],
      annotations: {
        framerSupportedLayoutWidth: "any-prefer-fixed",
        framerDisableUnlink: "*",
        framerIntrinsicHeight: "220",
        framerSupportedLayoutHeight: "any-prefer-fixed",
        framerContractVersion: "1",
        framerIntrinsicWidth: "320",
      },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
//# sourceMappingURL=./PixelHover.map
