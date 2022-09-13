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
  ],
  framework: "@storybook/react",
  core: {
    builder: "webpack5",
  },
}
