const presets = [
  [
    "@babel/preset-env",
    {
      useBuiltIns: "usage",
      corejs: 3,
      debug: true,
    },
  ],
  "@babel/preset-react",
  "@babel/preset-typescript",
];
const plugins = ["@babel/plugin-transform-regenerator", "@babel/plugin-transform-runtime"];

module.exports = { presets, plugins };
