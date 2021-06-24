const { user } = require("../models/User");

var auth = async function authenticateToken(req, res, next) {
  var user_id = req.headers.token;
  if (user_id) {
    // user.findOne({ _id: user_id }, function (err, userDetails) {
      const userDetails = await user.findOne({ where: { id: user_id } });

      if (userDetails && userDetails.id) {
        req.user = userDetails;
        next();
      } else {
        res.status(500).json({
          message: "user not found",
        });
      }
    // });
  }else{
    res.status(500).json({
        message: "token not found",
      });
  }
};

exports.auth = auth;
