const { BadRequestException, NotFoundException } = require('./errors')

module.exports = async (err, req, res, next) => {
    if (err instanceof BadRequestException) {
      return res
        .status(400)
        .json({ message: err.message, timestamp: Date.now(), path: req.path });
    }
  
    if (err instanceof NotFoundException) {
      return res
        .status(404)
        .json({ message: err.message, timestamp: Date.now(), path: req.path });
    }
  
    res
      .status(500)
      .json({ message: err.message, timestamp: Date.now(), path: req.path });
  };