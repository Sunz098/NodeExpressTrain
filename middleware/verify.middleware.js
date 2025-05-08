const jwt = require('jsonwebtoken');

module.exports = function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({status:401, message: 'ไม่ได้รับ token หรือรูปแบบไม่ถูกต้อง' , data:null });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; 
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ status:401,message: 'Token ไม่ถูกต้องหรือหมดอายุ' ,data:null });
  }
};
