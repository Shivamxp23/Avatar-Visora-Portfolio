import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import {
  Children,
  useEffect,
  useState,
  useRef,
  useMemo,
  createRef,
  useCallback,
  cloneElement,
} from "react";
import { addPropertyControls, ControlType, RenderTarget } from "framer";
import {
  LayoutGroup,
  useMotionValue,
  useTransform,
  motion,
  frame,
} from "framer-motion";
import { resize } from "@motionone/dom";
import { ComponentMessage } from "https://framer.com/m/Utils-FINc.js";
import { isDesktop } from "react-device-detect";
const MAX_DUPLICATED_ITEMS = 100;
const directionTransformers = {
  left: (offset) => `translateX(-${offset}px)`,
  right: (offset) => `translateX(-${offset}px)`,
  top: (offset) => `translateY(-${offset}px)`,
  bottom: (offset) => `translateY(-${offset}px)`,
};
/**
 * @framerIntrinsicWidth 400
 * @framerIntrinsicHeight 200
 *
 * @framerDisableUnlink
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */ export default function VirtualScrollTicker(props) {
  const {
    slots,
    gap,
    padding,
    paddingPerSide,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    speed,
    direction,
    alignment,
    sizingOptions,
    fadeOptions,
    style,
  } = props;
  const { fadeContent, overflow, fadeWidth, fadeInset, fadeAlpha } =
    fadeOptions;
  const { widthType, heightType } = sizingOptions;
  const paddingValue = paddingPerSide
    ? `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`
    : `${padding}px`;
  const isCanvas = RenderTarget.current() === RenderTarget.canvas;
  const filteredSlots = slots.filter(Boolean);
  const numChildren = Children.count(filteredSlots);
  const hasChildren = numChildren > 0;
  const isHorizontal = direction === "left" || direction === "right";
  const parentRef = useRef(null);
  const childrenRef = useMemo(() => {
    return [/*#__PURE__*/ createRef(), /*#__PURE__*/ createRef()];
  }, []);
  const [size, setSize] = useState({ parent: null, children: null });
  let clonedChildren = [];
  let dupedChildren = [];
  let duplicateBy = 0;
  let opacity = 0;
  if (isCanvas) {
    duplicateBy = numChildren ? Math.floor(10 / numChildren) : 0;
    opacity = 1;
  }
  if (!isCanvas && hasChildren && size.parent) {
    duplicateBy = Math.round((size.parent / size.children) * 2) + 1;
    duplicateBy = Math.min(duplicateBy, MAX_DUPLICATED_ITEMS);
    opacity = 1;
  }
  const measure = useCallback(() => {
    if (hasChildren && parentRef.current) {
      const parentLength = isHorizontal
        ? parentRef.current.offsetWidth
        : parentRef.current.offsetHeight;
      const start = childrenRef[0].current
        ? isHorizontal
          ? childrenRef[0].current.offsetLeft
          : childrenRef[0].current.offsetTop
        : 0;
      const end = childrenRef[1].current
        ? isHorizontal
          ? childrenRef[1].current.offsetLeft +
            childrenRef[1].current.offsetWidth
          : childrenRef[1].current.offsetTop +
            childrenRef[1].current.offsetHeight
        : 0;
      const childrenLength = end - start + gap;
      setSize({ parent: parentLength, children: childrenLength });
    }
  }, []);
  const childrenStyles = isCanvas ? { contentVisibility: "auto" } : {};
  if (hasChildren) {
    if (!isCanvas) {
      let initialResize = useRef(true);
      useEffect(() => {
        frame.read(measure);
        return resize(parentRef.current, ({ contentSize }) => {
          if (
            !initialResize.current &&
            (contentSize.width || contentSize.height)
          ) {
            frame.read(measure);
          }
          initialResize.current = false;
        });
      }, []);
    }
    clonedChildren = Children.map(filteredSlots, (child, index) => {
      var _child_props, _child_props1, _child_props2, _child_props3;
      let ref;
      if (index === 0) {
        ref = childrenRef[0];
      }
      if (index === filteredSlots.length - 1) {
        ref = childrenRef[1];
      }
      const size = {
        width: widthType
          ? (_child_props = child.props) === null || _child_props === void 0
            ? void 0
            : _child_props.width
          : "100%",
        height: heightType
          ? (_child_props1 = child.props) === null || _child_props1 === void 0
            ? void 0
            : _child_props1.height
          : "100%",
      };
      return /*#__PURE__*/ _jsx(LayoutGroup, {
        inherit: "id",
        children: /*#__PURE__*/ _jsx("li", {
          ref: ref,
          style: size,
          children: /*#__PURE__*/ cloneElement(
            child,
            {
              style: {
                ...((_child_props2 = child.props) === null ||
                _child_props2 === void 0
                  ? void 0
                  : _child_props2.style),
                ...size,
                flexShrink: 0,
                ...childrenStyles,
              },
              layoutId: child.props.layoutId
                ? child.props.layoutId + "-original-" + index
                : undefined,
            },
            (_child_props3 = child.props) === null || _child_props3 === void 0
              ? void 0
              : _child_props3.children
          ),
        }),
      });
    });
  }
  if (!isCanvas) {
    for (let i = 0; i < duplicateBy; i++) {
      dupedChildren = [
        ...dupedChildren,
        ...Children.map(filteredSlots, (child, childIndex) => {
          var _child_props,
            _child_props1,
            _child_props2,
            _child_props3,
            _child_props4,
            _child_props5;
          const size = {
            width: widthType
              ? (_child_props = child.props) === null || _child_props === void 0
                ? void 0
                : _child_props.width
              : "100%",
            height: heightType
              ? (_child_props1 = child.props) === null ||
                _child_props1 === void 0
                ? void 0
                : _child_props1.height
              : "100%",
            willChange: "transform",
          };
          return /*#__PURE__*/ _jsx(
            LayoutGroup,
            {
              inherit: "id",
              children: /*#__PURE__*/ _jsx(
                "li",
                {
                  style: size,
                  "aria-hidden": true,
                  children: /*#__PURE__*/ cloneElement(
                    child,
                    {
                      key: i + " " + childIndex,
                      style: {
                        ...((_child_props2 = child.props) === null ||
                        _child_props2 === void 0
                          ? void 0
                          : _child_props2.style),
                        width: widthType
                          ? (_child_props3 = child.props) === null ||
                            _child_props3 === void 0
                            ? void 0
                            : _child_props3.width
                          : "100%",
                        height: heightType
                          ? (_child_props4 = child.props) === null ||
                            _child_props4 === void 0
                            ? void 0
                            : _child_props4.height
                          : "100%",
                        flexShrink: 0,
                        ...childrenStyles,
                      },
                      layoutId: child.props.layoutId
                        ? child.props.layoutId + "-dupe-" + i
                        : undefined,
                    },
                    (_child_props5 = child.props) === null ||
                      _child_props5 === void 0
                      ? void 0
                      : _child_props5.children
                  ),
                },
                i + "li" + childIndex
              ),
            },
            i + "lg" + childIndex
          );
        }),
      ];
    }
  }
  const offset = useMotionValue(0);
  const transformer = directionTransformers[direction];
  const transform = useTransform(offset, transformer);
  useEffect(() => {
    if (!isCanvas && size.children) {
      let lastScrollY = window.scrollY;
      let targetOffset = 0;
      let currentOffset = 0;
      let animationFrameId = null;
      let animationOnTouchId = null;
      const updateOffset = () => {
        const scrollDiff = isDesktop ? window.scrollY - lastScrollY : 0;
        lastScrollY = window.scrollY;
        switch (direction) {
          case "left":
          case "top":
            targetOffset += scrollDiff * speed;
            break;
          case "right":
          case "bottom":
            targetOffset -= scrollDiff * speed;
            break;
        }
        currentOffset += (targetOffset - currentOffset) * 0.1;
        if (currentOffset < 0) {
          currentOffset += size.children;
          targetOffset += size.children;
        } else if (currentOffset >= size.children) {
          currentOffset -= size.children;
          targetOffset -= size.children;
        }
        offset.set(currentOffset);
        animationFrameId = requestAnimationFrame(updateOffset);
      };
      animationFrameId = requestAnimationFrame(updateOffset);
      const handleWheel = (e) => {
        // For 100vh sites, we need to manually update the targetOffset
        if (document.documentElement.scrollHeight <= window.innerHeight) {
          e.preventDefault();
          switch (direction) {
            case "left":
            case "top":
              targetOffset += e.deltaY * speed;
              break;
            case "right":
            case "bottom":
              targetOffset -= e.deltaY * speed;
              break;
          }
        }
      };
      const handleTouchDevice = () => {
        switch (direction) {
          case "left":
          case "top":
            targetOffset += speed;
            break;
          case "right":
          case "bottom":
            targetOffset -= speed;
            break;
        }
        animationOnTouchId = !isDesktop
          ? requestAnimationFrame(handleTouchDevice)
          : null;
      };
      animationOnTouchId = requestAnimationFrame(handleTouchDevice);
      window.addEventListener("wheel", handleWheel, { passive: false });
      return () => {
        window.removeEventListener("wheel", handleWheel);
        if (animationOnTouchId !== null) {
          cancelAnimationFrame(animationOnTouchId);
        }
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    }
  }, [speed, direction, size.children]);
  const fadeDirection = isHorizontal ? "to right" : "to bottom";
  const fadeWidthStart = fadeWidth / 2;
  const fadeWidthEnd = 100 - fadeWidth / 2;
  const fadeInsetStart = clamp(fadeInset, 0, fadeWidthStart);
  const fadeInsetEnd = 100 - fadeInset;
  const fadeMask = `linear-gradient(${fadeDirection}, rgba(0, 0, 0, ${fadeAlpha}) ${fadeInsetStart}%, rgba(0, 0, 0, 1) ${fadeWidthStart}%, rgba(0, 0, 0, 1) ${fadeWidthEnd}%, rgba(0, 0, 0, ${fadeAlpha}) ${fadeInsetEnd}%)`;
  if (!hasChildren) {
    return /*#__PURE__*/ _jsx(ComponentMessage, {
      title: "Ticker Scroll Component",
      subtitle: "Add layers or components to infinitely loop on your page.",
    });
  }
  return /*#__PURE__*/ _jsx("section", {
    style: {
      ...containerStyle,
      opacity: opacity,
      WebkitMaskImage: fadeContent ? fadeMask : undefined,
      MozMaskImage: fadeContent ? fadeMask : undefined,
      maskImage: fadeContent ? fadeMask : undefined,
      overflow: overflow ? "visible" : "hidden",
      padding: paddingValue,
    },
    ref: parentRef,
    children: /*#__PURE__*/ _jsxs(motion.ul, {
      style: {
        ...containerStyle,
        gap: gap,
        placeItems: alignment,
        position: "relative",
        flexDirection: isHorizontal ? "row" : "column",
        ...style,
        willChange: isCanvas ? "auto" : "transform",
        transform: transform,
      },
      children: [clonedChildren, dupedChildren],
    }),
  });
}
VirtualScrollTicker.defaultProps = {
  gap: 10,
  padding: 10,
  speed: 0.5,
  sizingOptions: { widthType: true, heightType: true },
  fadeOptions: {
    fadeContent: true,
    overflow: false,
    fadeWidth: 25,
    fadeAlpha: 0,
    fadeInset: 0,
  },
  direction: "left",
};
VirtualScrollTicker.displayName = "Ticker Scroll";
addPropertyControls(VirtualScrollTicker, {
  slots: {
    type: ControlType.Array,
    title: "Children",
    control: { type: ControlType.ComponentInstance },
  },
  speed: {
    type: ControlType.Number,
    title: "Speed",
    min: 0,
    max: 5,
    defaultValue: 0.5,
    step: 0.1,
    displayStepper: true,
  },
  direction: {
    type: ControlType.Enum,
    title: "Direction",
    options: ["left", "right", "top", "bottom"],
    optionIcons: [
      "direction-left",
      "direction-right",
      "direction-up",
      "direction-down",
    ],
    optionTitles: ["Left", "Right", "Top", "Bottom"],
    defaultValue: "left",
    displaySegmentedControl: true,
  },
  alignment: {
    type: ControlType.Enum,
    title: "Align",
    options: ["flex-start", "center", "flex-end"],
    optionIcons: {
      direction: {
        right: ["align-top", "align-middle", "align-bottom"],
        left: ["align-top", "align-middle", "align-bottom"],
        top: ["align-left", "align-center", "align-right"],
        bottom: ["align-left", "align-center", "align-right"],
      },
    },
    defaultValue: "center",
    displaySegmentedControl: true,
  },
  gap: { type: ControlType.Number, title: "Gap" },
  padding: {
    title: "Padding",
    type: ControlType.FusedNumber,
    toggleKey: "paddingPerSide",
    toggleTitles: ["Padding", "Padding per side"],
    valueKeys: ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"],
    valueLabels: ["T", "R", "B", "L"],
    min: 0,
  },
  sizingOptions: {
    type: ControlType.Object,
    title: "Sizing",
    controls: {
      widthType: {
        type: ControlType.Boolean,
        title: "Width",
        enabledTitle: "Auto",
        disabledTitle: "Stretch",
        defaultValue: true,
      },
      heightType: {
        type: ControlType.Boolean,
        title: "Height",
        enabledTitle: "Auto",
        disabledTitle: "Stretch",
        defaultValue: true,
      },
    },
  },
  fadeOptions: {
    type: ControlType.Object,
    title: "Clipping",
    description:
      "More components at [Framer University](https://frameruni.link/cc).",
    controls: {
      fadeContent: {
        type: ControlType.Boolean,
        title: "Fade",
        defaultValue: true,
      },
      overflow: {
        type: ControlType.Boolean,
        title: "Overflow",
        enabledTitle: "Show",
        disabledTitle: "Hide",
        defaultValue: false,
        hidden(props) {
          return props.fadeContent === true;
        },
      },
      fadeWidth: {
        type: ControlType.Number,
        title: "Width",
        defaultValue: 25,
        min: 0,
        max: 100,
        unit: "%",
        hidden(props) {
          return props.fadeContent === false;
        },
      },
      fadeInset: {
        type: ControlType.Number,
        title: "Inset",
        defaultValue: 0,
        min: 0,
        max: 100,
        unit: "%",
        hidden(props) {
          return props.fadeContent === false;
        },
      },
      fadeAlpha: {
        type: ControlType.Number,
        title: "Opacity",
        defaultValue: 0,
        min: 0,
        max: 1,
        step: 0.05,
        hidden(props) {
          return props.fadeContent === false;
        },
      },
    },
  },
});
const containerStyle = {
  display: "flex",
  width: "100%",
  height: "100%",
  maxWidth: "100%",
  maxHeight: "100%",
  placeItems: "center",
  margin: 0,
  padding: 0,
  listStyleType: "none",
  textIndent: "none",
};
const placeholderStyles = {
  display: "flex",
  width: "100%",
  height: "100%",
  placeContent: "center",
  placeItems: "center",
  flexDirection: "column",
  color: "#96F",
  background: "rgba(136, 85, 255, 0.1)",
  fontSize: 11,
  overflow: "hidden",
  padding: "20px 20px 30px 20px",
};
const emojiStyles = { fontSize: 32, marginBottom: 10 };
const titleStyles = {
  margin: 0,
  marginBottom: 10,
  fontWeight: 600,
  textAlign: "center",
};
const subtitleStyles = {
  margin: 0,
  opacity: 0.7,
  maxWidth: 150,
  lineHeight: 1.5,
  textAlign: "center",
};
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
export const __FramerMetadata__ = {
  exports: {
    default: {
      type: "reactComponent",
      name: "VirtualScrollTicker",
      slots: [],
      annotations: {
        framerDisableUnlink: "*",
        framerSupportedLayoutWidth: "fixed",
        framerContractVersion: "1",
        framerIntrinsicHeight: "200",
        framerSupportedLayoutHeight: "fixed",
        framerIntrinsicWidth: "400",
      },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
//# sourceMappingURL=./TickerScroll_Prod.map
