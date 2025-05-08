var express = require('express');
var router = express.Router();
var productSchema = require('../models/product.model')
const orderSchema = require('../models/order.model')
const approve = require('../middleware/approve.middleware') 
const verifyToken = require('../middleware/verify.middleware')

router.get('/',verifyToken,approve, async function(req, res) {
     try {
            const orders = await orderSchema.find({})
            res.status(200).send({
                status: 200,
                message: 'ดึง order ทุกรายการสำเร็จ',
                data: orders
              });
        } catch (error) {
            console.error(error);
        res.status(500).send({
          status: 500,
          message: 'เกิดข้อผิดพลาด',
          data: []
        });
        }
})

module.exports = router;