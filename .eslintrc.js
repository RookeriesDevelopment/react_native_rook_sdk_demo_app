module.exports = {
  root: true,
  extends: [
    '@react-native',
    'plugin:jest/recommended', // Add this line
  ],
  plugins: ['jest'], // Ensure the plugin is listed
};
