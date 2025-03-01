const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "all": "off", // Disable all rules
    },
  },
];

export default eslintConfig;
