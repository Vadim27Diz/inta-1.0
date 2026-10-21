import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-docs",
    "storybook-addon-pseudo-states"
  ],
  "framework": "@storybook/react-vite",
  // manager-head.html грузит шрифты по абсолютному пути /fonts/*.woff2 (отдельный бандл manager,
  // без доступа к Vite dev-серверу preview) — без staticDirs public/ не попадает в
  // storybook-static при build-storybook, и шрифты 404 только в проде (в dev отдаёт сам Vite).
  "staticDirs": ["../public"]
};
export default config;