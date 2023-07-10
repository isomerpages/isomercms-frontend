module.exports = {
  env: (config) => ({
    ...config,
    REACT_APP_BACKEND_URL: process.env.REACT_APP_BACKEND_URL,
  }),
  stories: [
    "./foundations/**/*.stories.@(mdx|js|jsx|ts|tsx)",
    "../src/**/*.stories.@(mdx|js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app",
    "@storybook/addon-mdx-gfm",
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  staticDirs: ["../public"], //👈 Configures the static asset folder in Storybook
  docs: {
    autodocs: true,
  },
  features: {
    storyStoreV7: true,
    previewMdx2: true,
  },
}
