// NOTE: Taken from https://answers.netlify.com/t/unable-to-set-npm-package-version-in-the-environment-variables/77584
/* eslint-disable no-param-reassign */
export const onPreBuild = function ({ netlifyConfig, packageJson }) {
  netlifyConfig.build.environment.REACT_APP_VERSION = packageJson.version
}
