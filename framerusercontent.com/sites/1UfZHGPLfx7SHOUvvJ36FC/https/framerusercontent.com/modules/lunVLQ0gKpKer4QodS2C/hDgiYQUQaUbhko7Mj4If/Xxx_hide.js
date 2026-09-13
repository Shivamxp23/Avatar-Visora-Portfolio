import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
export function withoutFramerBadge(Component) {
  return (props) => {
    return /*#__PURE__*/ _jsxs(_Fragment, {
      children: [
        /*#__PURE__*/ _jsx("style", {
          children: `
                        #__framer-badge-container { display: none !important; }
                    `,
        }),
        /*#__PURE__*/ _jsx(Component, { ...props }),
      ],
    });
  };
}
export const __FramerMetadata__ = {
  exports: {
    withoutFramerBadge: {
      type: "reactHoc",
      name: "withoutFramerBadge",
      annotations: { framerContractVersion: "1" },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
//# sourceMappingURL=./Xxx_hide.map
