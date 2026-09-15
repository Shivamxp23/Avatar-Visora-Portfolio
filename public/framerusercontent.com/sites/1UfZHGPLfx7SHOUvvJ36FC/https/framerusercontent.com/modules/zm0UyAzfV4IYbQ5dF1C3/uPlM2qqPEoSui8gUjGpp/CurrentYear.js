import { jsx as _jsx } from "react/jsx-runtime";
export function AutoCopyrightStatement(Component) {
  return (props) => {
    const textProps = props.children?.props?.children?.props;
    if (textProps && typeof textProps.children == "string") {
      textProps.children = textProps.children.replace(
        "YYYY",
        new Date().getFullYear()
      );
    }
    return /*#__PURE__*/ _jsx(Component, { ...props });
  };
}
export const __FramerMetadata__ = {
  exports: {
    AutoCopyrightStatement: {
      type: "reactHoc",
      name: "AutoCopyrightStatement",
      annotations: { framerContractVersion: "1" },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
//# sourceMappingURL=./CurrentYear.map
