const jwtConfig = {
  access: {
    expiresIn: `${1000 * 60 * 5}`, //  5 minutes
  },
  refresh: {
    expiresIn: `${1000 * 60 * 60 * 12}`, // 12 hours
  },
};

module.exports = jwtConfig;
