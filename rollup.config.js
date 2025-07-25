import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import PeerDepsExternalPlugin from "rollup-plugin-peer-deps-external";
import dts from "rollup-plugin-dts";
import postcss from "rollup-plugin-postcss";

const packageJson = require("./package.json");

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      PeerDepsExternalPlugin(),
      typescript({ tsconfig: "./tsconfig.json" }),
      nodeResolve(),
      commonjs(),
      postcss(),
      terser(),
    ],
    external: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
    ],
  },
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.types,
      },
    ],
    plugins: [dts.default()],
    external: [/\.css/],
  },
];
