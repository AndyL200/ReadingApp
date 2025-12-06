const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const {withNativeWind} = require("nativewind/metro")

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

console.log("\n\t\t", __dirname)
const config = mergeConfig(getDefaultConfig(__dirname), {
    resolver: {
        alias: {
            '@/': './',
        }
    }
});

module.exports = withNativeWind(config, { input : "./global.css"});
