function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  }
  
  function checkAdmin(req, res, next) {
    if (req.user && req.user.isAdmin) {
      return next();
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  }
  
  module.exports = {
    checkAuth,
    checkAdmin,
  };  