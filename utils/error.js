class HttpError extends Error {
    constructor(message, status) {
      super(message);
      this.status = status;
    }
  }
  
  function handleErrors(err, req, res, next) {
    console.error(err);
  
    if (err instanceof HttpError) {
      res.status(err.status).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  module.exports = {
    HttpError,
    handleErrors,
  };  