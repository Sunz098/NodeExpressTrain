const User = require('../models/user.model'); 

module.exports = async function checkApprove(req, res, next) {
  try {
    const user = await User.findById(req.user._id );

    if (!user) {
      return res.status(401).send({status:401, message: 'ไม่พบผู้ใช้งาน' ,data: null });
    }

    if (user.status !== 'approve') {
      return res.status(401).send({status:401, message: 'ไม่มีสิทธิ' ,data:null });
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).send({status:500, message: 'เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์',data:null });
  }
};
