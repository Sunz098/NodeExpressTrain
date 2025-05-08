var express = require('express');
var router = express.Router();
var productSchema = require('../models/product.model');
var verifyToken = require('../middleware/verify.middleware')
const path = require('path'); 
const approve = require('../middleware/approve.middleware')
const orderSchema = require('../models/order.model')



//getall product
router.get('/',verifyToken,approve, async function(req, res) {
    try {
        const products = await productSchema.find({})
        res.status(200).send({
            status: 200,
            message: 'ดึงรายการสินค้าสำเร็จ',
            data: products
          });
    } catch (error) {
        console.error(error);
    res.status(500).send({
      status: 500,
      message: message.error,
      data: []
    });
    }
});



//post 
router.post('/', verifyToken,approve,async function(req, res) {
    try {
        const {name , price , stock} = req.body;

        if(!name || price=== undefined ){
            return res.status(400).send({
                status: 400,
                message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                data: null
              });
        };

        const product = new productSchema({
            name,
            price,
            stock :stock || 0 , 
            userId : req.user._id
        });

        await product.save()
        res.status(201).send({
            status: 201,
            message: 'เพิ่มสินค้าเรียบร้อย',
            data: product
          });
    } catch (error) {
        console.error(error);
        res.status(500).send({
          status: 500,
          message: 'เกิดข้อผิดพลาดขณะเพิ่มสินค้า',
          data: null
        });
    }
}); 



//update product by id
router.put('/:id',verifyToken,approve, async function(req, res) {
    try {
        const {name , price , stock } = req.body;
        const {id} = req.params

        if(!name || price=== undefined ){
            return res.status(400).send({
                status: 400,
                message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                data: null
              });
        };

        const product = await productSchema.findByIdAndUpdate(id,{
            name,
            price,
            stock :stock || 0 , 
            userId : req.user._id
        },{new:true})

        res.status(200).send({
            status: 200,
            message: 'แก้ไขสินค้าเรียบร้อย',
            data: product
          });
    } catch (error) {
        console.error(error);
        res.status(500).send({
          status: 500,
          message: 'เกิดข้อผิดพลาดขณะแก้ไขสินค้า',
          data: null
        });
    }
});


//delete product by id
router.delete('/:id',verifyToken,approve, async function(req, res) {
    try {
        const {id} = req.params
        const product = await productSchema.findByIdAndDelete(id)

        if(!product){
            return res.status(404).send({
                status: 404,
                message: 'ไม่พบสินค้า',
                data: null
              });
        }

        res.status(200).send({
            status: 200,
            message: 'ลบสินค้าเรียบร้อย',
            data: product
          });
    } catch (error) {
        console.error(error);
        res.status(500).send({
          status: 500,
          message: 'เกิดข้อผิดพลาดขณะลบสินค้า',
          data: null
        });
    }
});

//get product by id
router.get('/:id',verifyToken,approve, async function(req, res) {
    try {
        const {id} = req.params
        const product = await productSchema.findById(id)

        if(!product){
            return res.status(404).send({
                status: 404,
                message: 'ไม่พบสินค้า',
                data: null
              });
        }

        res.status(200).send({
            status: 200,
            message: 'ดึงข้อมูลสินค้าสำเร็จ',
            data: product
          });
    } catch (error) {
        console.error(error);
        res.status(500).send({
          status: 500,
          message: 'เกิดข้อผิดพลาดขณะดึงข้อมูลสินค้า',
          data: null
        });
    }
}); 



router.post('/:id/order',verifyToken,approve, async function(req, res) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
  
      // ตรวจสอบว่า product นี้มีอยู่จริงหรือไม่
      const product = await productSchema.findById(id);
  
      if (!product) {
        return res.status(404).send({
          status: 404,
          message: 'ไม่พบสินค้า',
          data: null
        });
      }
  
      // ตรวจสอบจำนวนสินค้าคงเหลือ
      if (product.stock < quantity) {
        return res.status(400).send({
          status: 400,
          message: 'จำนวนสินค้าไม่เพียงพอ',
          data: null
        });
      }
  
      // สร้าง order ใหม่
      const newOrder = new orderSchema({
        product_id: id,
        product_name: product.name,
        price: product.price,
        quantity: quantity,
        userId: req.user._id
      });
  
      const savedOrder = await newOrder.save();
  
      // อัพเดทจำนวนสินค้าคงเหลือ
      product.stock -= quantity;
      await product.save();
  
      res.status(201).send({
        status: 201,
        message: 'เพิ่ม Order สำเร็จ',
        data: savedOrder
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).send({
        status: 500,
        message: 'เกิดข้อผิดพลาดขณะเพิ่ม Order',
        data: null
      });
    }
  });


  // ดึงรายการ Orders ทั้งหมดของ Product ตาม ID
router.get('/:id/order',verifyToken,approve, async function(req, res) {
    try {
      const { id } = req.params;
      
      // ตรวจสอบว่า product นี้มีอยู่จริงหรือไม่
      const product = await productSchema.findById(id);
      
      if (!product) {
        return res.status(404).send({
          status: 404,
          message: 'ไม่พบสินค้า',
          data: null
        });
      }
      
      // ดึงรายการ orders ทั้งหมดที่เกี่ยวข้องกับ product นี้
      const orders = await orderSchema.find({ product_id: id });
      
      res.status(200).send({
        status: 200,
        message: 'ดึงข้อมูล Orders ของสินค้าสำเร็จ',
        data: orders
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        status: 500,
        message: 'เกิดข้อผิดพลาดขณะดึงข้อมูล Orders ของสินค้า',
        data: null
      });
    }
  });


module.exports = router;