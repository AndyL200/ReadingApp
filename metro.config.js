const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const {withNativeWind} = require("nativewind/metro")
const path = require("path")

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const projectRoot = path.resolve(__dirname);
console.log("\n\t\t", projectRoot)


const config = mergeConfig(getDefaultConfig(projectRoot), {
    resolver: {
    alias: {
      '@': projectRoot,
    },
  },
});



module.exports = withNativeWind(config, { input : path.resolve(projectRoot, "global.css")});