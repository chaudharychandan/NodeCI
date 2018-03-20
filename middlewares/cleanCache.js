const { clearHash } = require('../services/cache');

module.exports = async (req, res, next) => {
  const { id } = req.user;

  await next();

  clearHash(id);
};
