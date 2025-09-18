import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  // Base JavaScript configuration
  js.configs.recommended,

  // TypeScript configuration
  ...tseslint.configs.recommended,

  // Custom overrides
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      globals: {
        ...globals.node, // Use node globals instead of browser for backend
        ...globals.es2022,
      },
    },
    rules: {
      // ✅ Disable unused variable checks
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",

      // ✅ Disable other strict rules
      "no-undef": "off",
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-var-requires": "off",

      // ✅ Additional rules you might want to disable
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "prefer-const": "off",
      "no-empty": "off",
    },
  },
];
