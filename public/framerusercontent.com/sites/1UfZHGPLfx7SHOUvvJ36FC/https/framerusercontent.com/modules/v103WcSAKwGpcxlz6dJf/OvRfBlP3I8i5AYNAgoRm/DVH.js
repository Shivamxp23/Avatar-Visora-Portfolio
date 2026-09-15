import { jsx as _jsx } from "react/jsx-runtime";
export const dynamicViewportHeight = (Component) => {
  return (props) => {
    return /*#__PURE__*/ _jsx(Component, {
      ...props,
      style: { height: "100dvh" },
    });
  };
};
export const __FramerMetadata__ = {
  exports: {
    dynamicViewportHeight: {
      type: "reactHoc",
      name: "dynamicViewportHeight",
      annotations: { framerContractVersion: "1" },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
//# sourceMappingURL=./DVH.map
