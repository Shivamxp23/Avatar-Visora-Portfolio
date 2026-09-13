import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer";
import { useInView } from "framer-motion";
import { useMemo, useEffect, useRef, useState, startTransition } from "react"; // User request: add a "Pixel Reveal" toggle (default on) that preserves current behavior when enabled, and when disabled renders simple media with no pixel-reveal processing while keeping fit width/height sizing behavior intact.
const fallbackImage = {
  src: "https://framerusercontent.com/images/GfGkADagM4KEibNcIiRUWlfrR0.jpg",
  alt: "Gradient image",
};
const fallbackVideo =
  "https://framerusercontent.com/assets/MLWPbW1dUQawJLhhun3dBwpgJak.mp4";
const mediaAspectRatioCache = new Map();
function normalizeImage(value) {
  if (typeof value === "string" && value.trim()) {
    return { src: value.trim(), alt: "" };
  }
  if (value && typeof value === "object") {
    const src = typeof value.src === "string" ? value.src.trim() : "";
    if (src) return { src, alt: value.alt || "" };
  }
  return fallbackImage;
}
function normalizeVideoFile(value) {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (value && typeof value === "object") {
    const src =
      typeof value.src === "string"
        ? value.src.trim()
        : typeof value.url === "string"
        ? value.url.trim()
        : "";
    if (src) return src;
  }
  return fallbackVideo;
}
function normalizeNumber(value, fallback) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
function normalizeProps(props) {
  const mediaType =
    props.mediaType === "video" || props.mediaType === "color"
      ? props.mediaType
      : "image";
  return {
    image: normalizeImage(props.image),
    mediaType,
    pixelReveal: props.pixelReveal !== false,
    videoFile: normalizeVideoFile(props.videoFile),
    fillColor:
      typeof props.fillColor === "string" && props.fillColor
        ? props.fillColor
        : "#000000",
    reverse: props.reverse === true,
    cellsPerRow: normalizeNumber(props.cellsPerRow, 8),
    transitionLength: normalizeNumber(props.transitionLength, 4),
    revealDuration: normalizeNumber(props.revealDuration, 1.2),
    appearThreshold: normalizeNumber(props.appearThreshold, 0.25),
    appearOnce: props.appearOnce !== false,
    resetOnExit: props.resetOnExit === true,
    style: props.style,
  };
}
function SimpleMediaShell({ mediaType, image, videoFile, fillColor, style }) {
  const isWidthFill = style?.width === "100%";
  const isHeightFill = style?.height === "100%";
  const reservedAspectRatio =
    mediaType === "color"
      ? 1
      : mediaAspectRatioCache.get(
          mediaType === "video" ? videoFile : image.src
        );
  return /*#__PURE__*/ _jsxs("span", {
    style: {
      display: "block",
      position: "relative",
      width: "100%",
      height: "100%",
      minWidth: 5,
      minHeight: 5,
      overflow: "hidden",
      background: "transparent",
      ...style,
    },
    children: [
      (!isWidthFill || !isHeightFill) &&
        (mediaType === "image"
          ? /*#__PURE__*/ _jsx("img", {
              src: image.src,
              alt: image.alt || "",
              style: {
                display: "block",
                width: isWidthFill ? "100%" : "auto",
                height: isHeightFill ? "100%" : "auto",
                aspectRatio: reservedAspectRatio ?? undefined,
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
              draggable: false,
            })
          : mediaType === "video"
          ? /*#__PURE__*/ _jsx("video", {
              src: videoFile,
              muted: true,
              playsInline: true,
              controls: false,
              preload: "metadata",
              style: {
                display: "block",
                width: isWidthFill ? "100%" : "auto",
                height: isHeightFill ? "100%" : "auto",
                aspectRatio: reservedAspectRatio ?? undefined,
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })
          : /*#__PURE__*/ _jsx("span", {
              style: {
                display: "block",
                width: 1,
                height: 1,
                opacity: 0,
                pointerEvents: "none",
              },
            })),
      mediaType === "video"
        ? /*#__PURE__*/ _jsx("video", {
            src: videoFile,
            muted: true,
            autoPlay: true,
            playsInline: true,
            loop: true,
            controls: false,
            preload: "metadata",
            style: {
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            },
          })
        : mediaType === "color"
        ? /*#__PURE__*/ _jsx("span", {
            style: {
              position: "absolute",
              inset: 0,
              display: "block",
              background: fillColor,
            },
          })
        : /*#__PURE__*/ _jsx("img", {
            src: image.src,
            alt: image.alt || "",
            style: {
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            },
            draggable: false,
          }),
    ],
  });
}
function SafeShell({ mediaType, image, videoFile, fillColor, reverse, style }) {
  return /*#__PURE__*/ _jsx("span", {
    style: {
      display: "block",
      position: "relative",
      width: "100%",
      height: "100%",
      minWidth: 5,
      minHeight: 5,
      overflow: "hidden",
      background: "transparent",
      ...style,
    },
    children: reverse
      ? null
      : mediaType === "video"
      ? /*#__PURE__*/ _jsx("video", {
          src: videoFile,
          muted: true,
          autoPlay: false,
          playsInline: true,
          loop: true,
          controls: false,
          preload: "metadata",
          style: {
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          },
        })
      : mediaType === "color"
      ? /*#__PURE__*/ _jsx("span", {
          style: {
            display: "block",
            width: "100%",
            height: "100%",
            background: fillColor,
          },
        })
      : /*#__PURE__*/ _jsx("img", {
          src: image.src,
          alt: image.alt || "",
          style: {
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          },
          draggable: false,
        }),
  });
}
function BootShell({ mediaType, image, videoFile, style }) {
  const isWidthFill = style?.width === "100%";
  const isHeightFill = style?.height === "100%";
  return /*#__PURE__*/ _jsxs("span", {
    style: {
      display: "block",
      position: "relative",
      width: "100%",
      height: "100%",
      minWidth: 5,
      minHeight: 5,
      overflow: "hidden",
      background: "transparent",
      ...style,
    },
    children: [
      (!isWidthFill || !isHeightFill) &&
        (mediaType === "image"
          ? /*#__PURE__*/ _jsx("img", {
              src: image.src,
              alt: image.alt || "",
              style: {
                display: "block",
                width: isWidthFill ? "100%" : "auto",
                height: isHeightFill ? "100%" : "auto",
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
              draggable: false,
            })
          : mediaType === "video"
          ? /*#__PURE__*/ _jsx("video", {
              src: videoFile,
              muted: true,
              playsInline: true,
              controls: false,
              preload: "metadata",
              style: {
                display: "block",
                width: isWidthFill ? "100%" : "auto",
                height: isHeightFill ? "100%" : "auto",
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })
          : /*#__PURE__*/ _jsx("span", {
              style: {
                display: "block",
                width: 1,
                height: 1,
                opacity: 0,
                pointerEvents: "none",
              },
            })),
      /*#__PURE__*/ _jsx("canvas", {
        style: {
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
        },
        "aria-hidden": true,
      }),
    ],
  });
}
/**
 * @framerDisableUnlink
 *
 * @framerIntrinsicWidth 400
 * @framerIntrinsicHeight 250
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */ export default function PixelRevealOnAppear(props) {
  const isStatic = useIsStaticRenderer();
  const normalized = useMemo(
    () => normalizeProps(props),
    [
      props.image,
      props.mediaType,
      props.pixelReveal,
      props.videoFile,
      props.fillColor,
      props.reverse,
      props.cellsPerRow,
      props.transitionLength,
      props.revealDuration,
      props.appearThreshold,
      props.appearOnce,
      props.resetOnExit,
      props.style,
    ]
  );
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (!normalized.pixelReveal) {
      startTransition(() => setMounted(true));
      return;
    }
    const id = window.requestAnimationFrame(() =>
      startTransition(() => setMounted(true))
    );
    return () => window.cancelAnimationFrame(id);
  }, [normalized.pixelReveal]);
  if (isStatic) return /*#__PURE__*/ _jsx(SafeShell, { ...normalized });
  if (!normalized.pixelReveal)
    return /*#__PURE__*/ _jsx(SimpleMediaShell, { ...normalized });
  if (!mounted) return /*#__PURE__*/ _jsx(BootShell, { ...normalized });
  return /*#__PURE__*/ _jsx(PixelRevealRuntime, { ...normalized });
}
function PixelRevealRuntime(props) {
  const {
    image,
    mediaType,
    videoFile,
    fillColor,
    reverse,
    cellsPerRow,
    transitionLength,
    revealDuration,
    appearThreshold,
    appearOnce,
    resetOnExit,
    style,
  } = props;
  const isWidthFill = style?.width === "100%";
  const isHeightFill = style?.height === "100%";
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const offscreenRef = useRef(null);
  const resolvedFillColor = useMemo(() => {
    if (typeof window === "undefined") return fillColor;
    if (!document.body) return fillColor;
    try {
      const el = document.createElement("div");
      el.style.color = fillColor;
      el.style.display = "none";
      document.body.appendChild(el);
      const computed = window.getComputedStyle(el).color;
      document.body.removeChild(el);
      return computed || fillColor;
    } catch {
      return fillColor;
    }
  }, [fillColor]);
  const inView = useInView(containerRef, {
    amount: Math.max(0, Math.min(1, appearThreshold)),
    once: appearOnce,
  });
  const anyVisible = useInView(containerRef, { amount: 0, once: false });
  const [measuredSize, setMeasuredSize] = useState({ width: 400, height: 400 });
  const progressRef = useRef(0);
  const pendingRevealStartRef = useRef(false);
  const revealLockedRef = useRef(false);
  const revealFinishedRef = useRef(false);
  const hasFullyLeftRef = useRef(true);
  const prevInViewRef = useRef(false);
  const anyVisibleRef = useRef(false);
  const initialProgress = reverse ? 1 : 0;
  const finalProgress = reverse ? 0 : 1;
  const [shuffleSeed, setShuffleSeed] = useState(() =>
    Math.floor(Date.now() % 2147483647)
  );
  const [imageEl, setImageEl] = useState(null);
  const [videoEl, setVideoEl] = useState(null);
  const [imageReadyToDraw, setImageReadyToDraw] = useState(false);
  const [videoReadyToDraw, setVideoReadyToDraw] = useState(false);
  const [mediaAspectRatio, setMediaAspectRatio] = useState(() => {
    if (mediaType === "color") return null;
    const cacheKey = mediaType === "video" ? videoFile : image.src;
    const cachedRatio = mediaAspectRatioCache.get(cacheKey);
    return cachedRatio && Number.isFinite(cachedRatio) && cachedRatio > 0
      ? cachedRatio
      : null;
  });
  const mediaReady = useMemo(() => {
    if (mediaType === "color") return true;
    if (mediaType === "image") return !!imageEl && imageReadyToDraw;
    return !!videoEl && videoReadyToDraw;
  }, [imageEl, imageReadyToDraw, mediaType, videoEl, videoReadyToDraw]);
  const videoFrameCancelRef = useRef(null);
  const rafRef = useRef(null);
  const animFromRef = useRef(0);
  const animToRef = useRef(0);
  const animStartRef = useRef(0);
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      startTransition(() => {
        setMeasuredSize((prev) =>
          prev.width === w && prev.height === h ? prev : { width: w, height: h }
        );
      });
    };
    update();
    let ro = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(update);
      ro.observe(el);
    } else {
      window.addEventListener("resize", update);
    }
    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", update);
    };
  }, []);
  useEffect(() => {
    if (mediaType === "color") {
      startTransition(() => setMediaAspectRatio(null));
      return;
    }
    const cacheKey = mediaType === "video" ? videoFile : image.src;
    const cachedRatio = mediaAspectRatioCache.get(cacheKey);
    startTransition(() => {
      setMediaAspectRatio(
        cachedRatio && Number.isFinite(cachedRatio) && cachedRatio > 0
          ? cachedRatio
          : null
      );
    });
  }, [image.src, mediaType, videoFile]);
  useEffect(() => {
    if (mediaType === "color") return;
    let cancelled = false;
    const setRatio = (ratio, key) => {
      if (!Number.isFinite(ratio) || ratio <= 0) return;
      mediaAspectRatioCache.set(key, ratio);
      if (!cancelled) startTransition(() => setMediaAspectRatio(ratio));
    };
    if (mediaType === "image") {
      const src = image.src;
      const probeImg = new window.Image();
      probeImg.onload = () => {
        if (cancelled) return;
        const iw = probeImg.naturalWidth || probeImg.width;
        const ih = probeImg.naturalHeight || probeImg.height;
        if (iw > 0 && ih > 0) setRatio(iw / ih, src);
      };
      probeImg.src = src;
      return () => {
        cancelled = true;
        probeImg.onload = null;
        probeImg.onerror = null;
        try {
          probeImg.src = "";
        } catch {}
      };
    }
    const src = videoFile;
    const probeVideo = document.createElement("video");
    probeVideo.preload = "metadata";
    const onLoadedMetadata = () => {
      if (cancelled) return;
      const vw = probeVideo.videoWidth;
      const vh = probeVideo.videoHeight;
      if (vw > 0 && vh > 0) setRatio(vw / vh, src);
    };
    probeVideo.addEventListener("loadedmetadata", onLoadedMetadata);
    probeVideo.src = src;
    try {
      probeVideo.load();
    } catch {}
    return () => {
      cancelled = true;
      probeVideo.removeEventListener("loadedmetadata", onLoadedMetadata);
      probeVideo.removeAttribute("src");
      try {
        probeVideo.load();
      } catch {}
    };
  }, [image.src, mediaType, videoFile]);
  useEffect(() => {
    if (!anyVisible) hasFullyLeftRef.current = true;
    anyVisibleRef.current = anyVisible;
  }, [anyVisible]);
  useEffect(() => {
    if (videoFrameCancelRef.current) {
      videoFrameCancelRef.current();
      videoFrameCancelRef.current = null;
    }
    startTransition(() => {
      setImageEl(null);
      setVideoEl(null);
      setImageReadyToDraw(false);
      setVideoReadyToDraw(false);
    });
    if (mediaType === "color") return;
    if (mediaType === "video") {
      const vid = document.createElement("video");
      vid.muted = true;
      vid.autoplay = false;
      vid.playsInline = true;
      vid.loop = true;
      vid.preload = "auto";
      vid.src = videoFile;
      vid.setAttribute("playsinline", "");
      vid.setAttribute("muted", "");
      const host = containerRef.current;
      if (host) {
        vid.style.position = "absolute";
        vid.style.width = "1px";
        vid.style.height = "1px";
        vid.style.opacity = "0";
        vid.style.pointerEvents = "none";
        vid.style.left = "0";
        vid.style.top = "0";
        vid.style.zIndex = "-1";
        host.appendChild(vid);
      }
      const markVideoReadyIfDrawable = () => {
        if (vid.videoWidth <= 0 || vid.videoHeight <= 0) return;
        if (vid.readyState < 2) return;
        startTransition(() => {
          setVideoEl(vid);
          setVideoReadyToDraw(true);
        });
      };
      const onLoadedMetadata = () => {
        const vw = vid.videoWidth;
        const vh = vid.videoHeight;
        if (vw > 0 && vh > 0) {
          const ratio = vw / vh;
          mediaAspectRatioCache.set(videoFile, ratio);
          startTransition(() => setMediaAspectRatio(ratio));
        }
      };
      const onError = () => {
        startTransition(() => {
          setVideoEl(null);
          setVideoReadyToDraw(false);
        });
      };
      vid.addEventListener("error", onError);
      vid.addEventListener("canplay", markVideoReadyIfDrawable);
      vid.addEventListener("loadedmetadata", onLoadedMetadata);
      vid.addEventListener("loadeddata", markVideoReadyIfDrawable);
      vid.addEventListener("seeked", markVideoReadyIfDrawable);
      const anyVid = vid;
      let rvfcHandle = 0;
      if (typeof anyVid.requestVideoFrameCallback === "function") {
        rvfcHandle = anyVid.requestVideoFrameCallback(() => {
          markVideoReadyIfDrawable();
        });
      } else {
        markVideoReadyIfDrawable();
      }
      let bootstrapCancelled = false;
      try {
        vid.load();
      } catch {}
      const bootPlay = vid.play();
      if (bootPlay && typeof bootPlay.then === "function") {
        bootPlay
          .then(() => {
            if (bootstrapCancelled) return;
            markVideoReadyIfDrawable();
            if (!anyVisibleRef.current) {
              try {
                vid.pause();
              } catch {}
            }
          })
          .catch(() => {});
      }
      return () => {
        bootstrapCancelled = true;
        vid.removeEventListener("error", onError);
        vid.removeEventListener("canplay", markVideoReadyIfDrawable);
        vid.removeEventListener("loadedmetadata", onLoadedMetadata);
        vid.removeEventListener("loadeddata", markVideoReadyIfDrawable);
        vid.removeEventListener("seeked", markVideoReadyIfDrawable);
        if (
          rvfcHandle &&
          typeof anyVid.cancelVideoFrameCallback === "function"
        ) {
          try {
            anyVid.cancelVideoFrameCallback(rvfcHandle);
          } catch {}
        }
        try {
          vid.pause();
        } catch {}
        if (vid.parentNode) vid.parentNode.removeChild(vid);
        vid.removeAttribute("src");
        try {
          vid.load();
        } catch {}
      };
    }
    let cancelled = false;
    const img = new window.Image();
    img.decoding = "async";
    img.onload = async () => {
      if (cancelled) return;
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;
      if (iw > 0 && ih > 0) {
        const ratio = iw / ih;
        mediaAspectRatioCache.set(image.src, ratio);
        startTransition(() => setMediaAspectRatio(ratio));
      }
      if (typeof img.decode === "function") {
        try {
          await img.decode();
        } catch {}
      }
      if (cancelled) return;
      const ready =
        (img.naturalWidth || img.width) > 0 &&
        (img.naturalHeight || img.height) > 0;
      startTransition(() => {
        setImageEl(ready ? img : null);
        setImageReadyToDraw(ready);
      });
    };
    img.onerror = () => {
      if (cancelled) return;
      startTransition(() => {
        setImageEl(null);
        setImageReadyToDraw(false);
      });
    };
    img.src = image.src;
    return () => {
      cancelled = true;
      img.onload = null;
      img.onerror = null;
      try {
        img.src = "";
      } catch {}
    };
  }, [image.src, mediaType, videoFile]);
  useEffect(() => {
    if (mediaType !== "video") return;
    const vid = videoEl;
    if (!vid) return;
    if (!anyVisible) {
      try {
        vid.pause();
      } catch {}
      return;
    }
    vid.muted = true;
    vid.defaultMuted = true;
    vid.playsInline = true;
    vid.setAttribute("muted", "");
    vid.setAttribute("playsinline", "");
    const tryPlay = () => {
      const p = vid.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          const retry = () => {
            vid.removeEventListener("canplay", retry);
            vid.removeEventListener("loadeddata", retry);
            if (!anyVisibleRef.current) return;
            const retryPlay = vid.play();
            if (retryPlay && typeof retryPlay.catch === "function") {
              retryPlay.catch(() => {});
            }
          };
          vid.addEventListener("canplay", retry, { once: true });
          vid.addEventListener("loadeddata", retry, { once: true });
        });
      }
    };
    tryPlay();
  }, [anyVisible, mediaType, videoEl]);
  const generatedZones = useMemo(() => {
    const zones = [];
    const width = measuredSize.width;
    const height = measuredSize.height;
    const gridColumns = Math.max(1, Math.round(cellsPerRow));
    const cellPx = width / gridColumns;
    const gridRows = Math.max(1, Math.ceil(height / Math.max(1, cellPx)));
    for (let row = 0; row < gridRows; row++) {
      const y0 = Math.round(row * cellPx);
      const y1 = Math.min(height, Math.round((row + 1) * cellPx));
      if (y0 >= height) break;
      for (let col = 0; col < gridColumns; col++) {
        const x0 = Math.round(col * cellPx);
        const x1 =
          col === gridColumns - 1 ? width : Math.round((col + 1) * cellPx);
        const xx0 = Math.max(0, Math.min(width, x0));
        const yy0 = Math.max(0, Math.min(height, y0));
        const xx1 = Math.max(xx0, Math.min(width, x1));
        const yy1 = Math.max(yy0, Math.min(height, y1));
        const zoneWidth = Math.max(0, xx1 - xx0);
        const zoneHeight = Math.max(0, yy1 - yy0);
        if (zoneWidth > 0 && zoneHeight > 0) {
          zones.push({ x: xx0, y: yy0, width: zoneWidth, height: zoneHeight });
        }
      }
    }
    return { zones, gridColumns, gridRows, width, height };
  }, [cellsPerRow, measuredSize.width, measuredSize.height]);
  const revealOrderIndex = useMemo(() => {
    const count = generatedZones.zones.length;
    const indices = Array.from({ length: count }, (_, i) => i);
    let s = Math.max(1, Math.floor(shuffleSeed));
    const rand = () => {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296;
    };
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      const tmp = indices[i];
      indices[i] = indices[j];
      indices[j] = tmp;
    }
    const orderIndex = new Array(count);
    for (let pos = 0; pos < count; pos++) orderIndex[indices[pos]] = pos;
    return orderIndex;
  }, [generatedZones.zones.length, shuffleSeed]);
  const total = generatedZones.zones.length || 1;
  const transitionLengthActual = useMemo(() => {
    const v = Number.isFinite(transitionLength) ? transitionLength : 4;
    if (v > 10) return Math.max(1e-4, v);
    const clamped = Math.max(1, Math.min(10, v));
    return 1 + ((clamped - 1) * 39) / 9;
  }, [transitionLength]);
  const effectiveTransitionLength = Math.max(1e-4, transitionLengthActual);
  const drawToCanvas = useMemo(() => {
    return (progressValue) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.max(
        1,
        Math.round((window.devicePixelRatio || 1) * 1e3) / 1e3
      );
      const cssW = Math.max(1, measuredSize.width);
      const cssH = Math.max(1, measuredSize.height);
      const pxW = Math.max(1, Math.round(cssW * dpr));
      const pxH = Math.max(1, Math.round(cssH * dpr));
      if (canvas.width !== pxW) canvas.width = pxW;
      if (canvas.height !== pxH) canvas.height = pxH;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      if (!offscreenRef.current) {
        offscreenRef.current = document.createElement("canvas");
      }
      const offscreen = offscreenRef.current;
      if (offscreen.width !== pxW) offscreen.width = pxW;
      if (offscreen.height !== pxH) offscreen.height = pxH;
      const octx = offscreen.getContext("2d");
      if (!octx) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, pxW, pxH);
      const source = mediaType === "video" ? videoEl : imageEl;
      const isColor = mediaType === "color";
      if (!isColor && !source) return;
      octx.setTransform(1, 0, 0, 1, 0, 0);
      octx.clearRect(0, 0, pxW, pxH);
      octx.imageSmoothingEnabled = true;
      octx.imageSmoothingQuality = "high";
      if (isColor) {
        octx.fillStyle = resolvedFillColor;
        octx.fillRect(0, 0, pxW, pxH);
      } else {
        const srcW = Math.max(
          1,
          mediaType === "video"
            ? source.videoWidth || 1
            : source.naturalWidth || source.width || 1
        );
        const srcH = Math.max(
          1,
          mediaType === "video"
            ? source.videoHeight || 1
            : source.naturalHeight || source.height || 1
        );
        const scale = Math.max(pxW / srcW, pxH / srcH);
        const drawnW = Math.round(srcW * scale);
        const drawnH = Math.round(srcH * scale);
        const offsetX = Math.round((pxW - drawnW) / 2);
        const offsetY = Math.round((pxH - drawnH) / 2);
        try {
          octx.drawImage(
            source,
            0,
            0,
            srcW,
            srcH,
            offsetX,
            offsetY,
            drawnW,
            drawnH
          );
        } catch {
          return;
        }
      }
      const globalT = progressValue * (total - 1 + effectiveTransitionLength);
      const indices = Array.from(
        { length: generatedZones.zones.length },
        (_, i) => i
      );
      const opacityByIndex = new Array(generatedZones.zones.length);
      for (let i = 0; i < generatedZones.zones.length; i++) {
        const orderPos = revealOrderIndex[i] ?? i;
        opacityByIndex[i] = Math.max(
          0,
          Math.min(1, (globalT - orderPos) / effectiveTransitionLength)
        );
      }
      indices.sort((a, b) => opacityByIndex[a] - opacityByIndex[b]);
      for (let idx = 0; idx < indices.length; idx++) {
        const i = indices[idx];
        const opacity = opacityByIndex[i];
        if (opacity <= 0) continue;
        const zone = generatedZones.zones[i];
        const x = Math.round(zone.x * dpr);
        const y = Math.round(zone.y * dpr);
        const w = Math.round(zone.width * dpr);
        const h = Math.round(zone.height * dpr);
        if (w <= 0 || h <= 0) continue;
        const x2 = Math.max(0, Math.min(pxW, x));
        const y2 = Math.max(0, Math.min(pxH, y));
        const w2 = Math.max(0, Math.min(pxW - x2, w));
        const h2 = Math.max(0, Math.min(pxH - y2, h));
        if (w2 <= 0 || h2 <= 0) continue;
        ctx.globalAlpha = opacity;
        try {
          ctx.drawImage(offscreen, x2, y2, w2, h2, x2, y2, w2, h2);
        } catch {
          ctx.globalAlpha = 1;
          return;
        }
      }
      ctx.globalAlpha = 1;
    };
  }, [
    effectiveTransitionLength,
    generatedZones.zones,
    imageEl,
    mediaType,
    measuredSize.height,
    measuredSize.width,
    revealOrderIndex,
    total,
    videoEl,
    resolvedFillColor,
  ]);
  useEffect(() => {
    if (mediaType !== "video") return;
    if (!anyVisible) return;
    const vid = videoEl;
    if (!vid) return;
    let rafId = null;
    let cancelled = false;
    const scheduleRaf = () => {
      if (cancelled) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        drawToCanvas(progressRef.current);
        scheduleRaf();
      });
    };
    const anyVid = vid;
    if (typeof anyVid.requestVideoFrameCallback === "function") {
      let handle = 0;
      const onFrame = () => {
        if (cancelled) return;
        drawToCanvas(progressRef.current);
        handle = anyVid.requestVideoFrameCallback(onFrame);
      };
      handle = anyVid.requestVideoFrameCallback(onFrame);
      videoFrameCancelRef.current = () => {
        cancelled = true;
        if (typeof anyVid.cancelVideoFrameCallback === "function") {
          try {
            anyVid.cancelVideoFrameCallback(handle);
          } catch {}
        }
      };
    } else {
      scheduleRaf();
      videoFrameCancelRef.current = () => {
        cancelled = true;
        if (rafId != null) window.cancelAnimationFrame(rafId);
      };
    }
    return () => {
      if (videoFrameCancelRef.current) {
        videoFrameCancelRef.current();
        videoFrameCancelRef.current = null;
      }
    };
  }, [anyVisible, drawToCanvas, mediaType, videoEl]);
  useEffect(() => {
    drawToCanvas(progressRef.current);
  }, [
    drawToCanvas,
    measuredSize.width,
    measuredSize.height,
    imageEl,
    videoEl,
    revealOrderIndex,
    mediaType,
  ]);
  useEffect(() => {
    if (revealLockedRef.current) return;
    progressRef.current = initialProgress;
    revealFinishedRef.current = false;
    drawToCanvas(initialProgress);
  }, [drawToCanvas, initialProgress]);
  useEffect(() => {
    const startReveal = () => {
      if (!appearOnce && !hasFullyLeftRef.current) return;
      hasFullyLeftRef.current = false;
      const nextSeed =
        (Date.now() + Math.floor(Math.random() * 1e6)) % 2147483647;
      startTransition(() => setShuffleSeed(nextSeed));
      revealLockedRef.current = true;
      revealFinishedRef.current = false;
      progressRef.current = initialProgress;
      drawToCanvas(initialProgress);
    };
    if (inView && !prevInViewRef.current) {
      prevInViewRef.current = true;
      if (!mediaReady) {
        pendingRevealStartRef.current = true;
      } else {
        startReveal();
      }
    }
    if (!inView) {
      prevInViewRef.current = false;
      pendingRevealStartRef.current = false;
    }
    if (inView && pendingRevealStartRef.current && mediaReady) {
      pendingRevealStartRef.current = false;
      startReveal();
    }
    const cancel = () => {
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
    const shouldReset = (!appearOnce || resetOnExit) && !anyVisible;
    if (shouldReset) {
      cancel();
      if (progressRef.current !== initialProgress) {
        progressRef.current = initialProgress;
        drawToCanvas(initialProgress);
      }
      revealLockedRef.current = false;
      revealFinishedRef.current = false;
      return;
    }
    if (!mediaReady) {
      cancel();
      return;
    }
    const target =
      (inView || revealLockedRef.current) && !revealFinishedRef.current
        ? finalProgress
        : progressRef.current;
    if (target === progressRef.current) return;
    animFromRef.current = progressRef.current;
    animToRef.current = target;
    animStartRef.current = performance.now();
    const durationMs = Math.max(0.001, revealDuration) * 1e3;
    const tick = (now) => {
      const t = Math.max(
        0,
        Math.min(1, (now - animStartRef.current) / durationMs)
      );
      const next =
        animFromRef.current + (animToRef.current - animFromRef.current) * t;
      if (Math.abs(next - progressRef.current) >= 0.001) {
        progressRef.current = next;
        drawToCanvas(next);
      }
      if (t < 1) {
        rafRef.current = window.requestAnimationFrame(tick);
      } else {
        progressRef.current = animToRef.current;
        drawToCanvas(animToRef.current);
        rafRef.current = null;
        if (Math.abs(animToRef.current - finalProgress) <= 0.001) {
          revealFinishedRef.current = true;
        }
      }
    };
    cancel();
    rafRef.current = window.requestAnimationFrame(tick);
    return cancel;
  }, [
    inView,
    anyVisible,
    revealDuration,
    appearOnce,
    resetOnExit,
    drawToCanvas,
    finalProgress,
    initialProgress,
    mediaReady,
  ]);
  const reservedAspectRatio =
    mediaType === "color" ? 1 : mediaAspectRatio ?? undefined;
  const updateImageRatioFromElement = (img) => {
    if (!img) return;
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    if (iw <= 0 || ih <= 0) return;
    const ratio = iw / ih;
    mediaAspectRatioCache.set(image.src, ratio);
    startTransition(() => setMediaAspectRatio(ratio));
  };
  const updateVideoRatioFromElement = (video) => {
    if (!video) return;
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (vw <= 0 || vh <= 0) return;
    const ratio = vw / vh;
    mediaAspectRatioCache.set(videoFile, ratio);
    startTransition(() => setMediaAspectRatio(ratio));
  };
  return /*#__PURE__*/ _jsxs("span", {
    ref: containerRef,
    style: {
      display: "block",
      position: "relative",
      width: "100%",
      height: "100%",
      minWidth: 5,
      minHeight: 5,
      overflow: "hidden",
      background: "transparent",
      ...style,
    },
    children: [
      (!isWidthFill || !isHeightFill) &&
        (mediaType === "image"
          ? /*#__PURE__*/ _jsx(
              "img",
              {
                src: image.src,
                alt: image.alt || "",
                onLoad: (event) =>
                  updateImageRatioFromElement(event.currentTarget),
                style: {
                  display: "block",
                  width: isWidthFill ? "100%" : "auto",
                  height: isHeightFill ? "100%" : "auto",
                  aspectRatio: reservedAspectRatio ?? undefined,
                  opacity: 0,
                  pointerEvents: "none",
                  userSelect: "none",
                },
                draggable: false,
              },
              `image-sizer-${image.src}`
            )
          : mediaType === "video"
          ? /*#__PURE__*/ _jsx(
              "video",
              {
                src: videoFile,
                muted: true,
                playsInline: true,
                controls: false,
                preload: "metadata",
                onLoadedMetadata: (event) =>
                  updateVideoRatioFromElement(event.currentTarget),
                style: {
                  display: "block",
                  width: isWidthFill ? "100%" : "auto",
                  height: isHeightFill ? "100%" : "auto",
                  aspectRatio: reservedAspectRatio ?? undefined,
                  opacity: 0,
                  pointerEvents: "none",
                  userSelect: "none",
                },
              },
              `video-sizer-${videoFile}`
            )
          : /*#__PURE__*/ _jsx("span", {
              style: {
                display: "block",
                width: 1,
                height: 1,
                opacity: 0,
                pointerEvents: "none",
              },
            })),
      /*#__PURE__*/ _jsx("canvas", {
        ref: canvasRef,
        style: {
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
        },
        "aria-hidden": true,
      }),
    ],
  });
}
addPropertyControls(PixelRevealOnAppear, {
  mediaType: {
    type: ControlType.Enum,
    title: "Media",
    options: ["image", "video", "color"],
    optionTitles: ["Image", "Video", "Color"],
    defaultValue: "image",
    displaySegmentedControl: true,
  },
  pixelReveal: {
    type: ControlType.Boolean,
    title: "Pixel Reveal",
    defaultValue: true,
    enabledTitle: "On",
    disabledTitle: "Off",
  },
  reverse: {
    type: ControlType.Boolean,
    title: "Reverse",
    defaultValue: false,
    enabledTitle: "On",
    disabledTitle: "Off",
  },
  image: {
    type: ControlType.ResponsiveImage,
    title: "Image",
    hidden: ({ mediaType }) => mediaType !== "image",
  },
  videoFile: {
    type: ControlType.File,
    title: "Video",
    allowedFileTypes: ["mp4", "webm", "mov"],
    hidden: ({ mediaType }) => mediaType !== "video",
  },
  fillColor: {
    type: ControlType.Color,
    title: "Fill",
    defaultValue: "#000000",
    hidden: ({ mediaType }) => mediaType !== "color",
  },
  cellsPerRow: {
    type: ControlType.Number,
    title: "Cells / Row",
    defaultValue: 8,
    min: 1,
    max: 40,
    step: 1,
  },
  transitionLength: {
    type: ControlType.Number,
    title: "Smoothness",
    defaultValue: 1.7,
    min: 1,
    max: 10,
    step: 0.1,
  },
  revealDuration: {
    type: ControlType.Number,
    title: "Reveal Duration",
    defaultValue: 1.2,
    min: 0.05,
    max: 10,
    step: 0.05,
    unit: "s",
  },
  appearThreshold: {
    type: ControlType.Number,
    title: "In-view Amount",
    defaultValue: 0.25,
    min: 0,
    max: 1,
    step: 0.05,
  },
  appearOnce: {
    type: ControlType.Boolean,
    title: "Once",
    defaultValue: true,
    enabledTitle: "Yes",
    disabledTitle: "No",
    description: "Component by Avataar Visora",
  },
  resetOnExit: {
    type: ControlType.Boolean,
    title: "Reset on Exit",
    defaultValue: false,
    enabledTitle: "On",
    disabledTitle: "Off",
    hidden: () => true,
  },
});
export const __FramerMetadata__ = {
  exports: {
    default: {
      type: "reactComponent",
      name: "PixelRevealOnAppear",
      slots: [],
      annotations: {
        framerIntrinsicWidth: "400",
        framerSupportedLayoutWidth: "any-prefer-fixed",
        framerContractVersion: "1",
        framerIntrinsicHeight: "250",
        framerDisableUnlink: "*",
        framerSupportedLayoutHeight: "any-prefer-fixed",
      },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
//# sourceMappingURL=./PixelRevealOnAppear.map
