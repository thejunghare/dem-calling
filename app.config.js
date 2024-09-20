module.exports = ({ config }) => {
  console.log(config.name);
  return {
    ...config,
  };
};
