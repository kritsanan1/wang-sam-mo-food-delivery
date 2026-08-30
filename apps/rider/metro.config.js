const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

const { resolver } = config;
resolver.alias = {
  "@": "./src",
};

module.exports = config;
