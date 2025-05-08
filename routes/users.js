var express = require('express');
var router = express.Router();
var userSchema = require('../models/user.model')
const multer = require('multer');
const path = require('path'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { console } = require('inspector');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime() + '_' + file.originalname)
  }
})

const upload = multer({ storage: storage })

/* GET users listing. */
// router.get('/',async function(req, res, next) {
//   let users = await userSchema.find({})
//   res.send(users)
// });

// router.post('/post', [tokenMiddleware,upload.single('image')] ,async function(req, res, next) {
//   let { name, age,password } = req.body;

//   let user = new userSchema({ name : name, age:age , password: await brcypt.hash("1234" , 10) });
//   let token = jwt.sign({foo : "bar"}, "1234")

//   // await user.save()
//   // res.send("User Created");
//   res.send(token);
// });


// router.put('/put/:id',async function(req, res,next){
//   let { id } = req.params;
//   let { name, age } = req.body;
//   let user = await userSchema.findByIdAndUpdate(id, { name, age }, { new: true });
//   res.send(user);
// })

// router.delete('/delete/:id',async function(req, res,next){
//   let { id } = req.params;
//   let user = await userSchema.findByIdAndDelete(id);
//   res.send(user);
// }) 


//register


router.post('/register', async function(req, res, next){
  try {
    const { name , username, password } = req.body; 

    if(!name || !username || !password){
      return res.status(400).send({ status:400 ,message: "กรุณากรอกข้อมูลให้ครบถ้วน",data:null });
    }


    const hashPassword = await bcrypt.hash(password, 10);

    const user = new userSchema({
      name: name,
      username: username,
      password: hashPassword
    });
    await user.save();
    res.status(201).send({ status:201 ,message: "สร้างสำเร็จ",data: user });
  } catch (error) {
    console.log(error);
    res.status(500).send({status:500,message: error.message,data:null});
  }
});

//login
router.post('/login', async function(req, res, next){
  try {
    const { username, password } = req.body;

    if(!username || !password){
      return res.status(400).send({status : 400,message: 'กรุณากรอกข้อมูลให้ครบถ้วน' ,data:null});
    }

    const user = await userSchema.findOne({username});
    if(!user){
      return res.status(400).send({
        status: 400,
        message: 'ไม่พบผู้ใช้งาน',
        data: null
      });
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(400).send({
        status: 400,
        message: 'รหัสผ่านไม่ถูกต้อง',
        data: null
      });    
    }

    if(user.status === 'not_approve'){
      return res.status(400).send({
        status: 400,
        message: 'ผู้ใช้งานยังไม่ได้รับการอนุมัติ',
        data: null
      });

    } 

    const token = jwt.sign(
      { _id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).send({
      status: 200,
      message: 'เข้าสู่ระบบสำเร็จ',
      data: {token}
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 500,
      message: message.error,
      data: null
    });  }
}) 


//update
router.put('/:id/approve', async function(req, res, next){
 try {
  const { id } = req.params;
  const {status} = req.body;

  if(!['approve', 'not_approve'].includes(status)){
    return res.status(400).send({status:400 ,message: "กรุณากรอกข้อมูลให้ครบถ้วน",data:null });
  }

  const updateUser = await userSchema.findByIdAndUpdate(id , {status}, {new : true});

  if(!updateUser){
    return res.status(404).send({status:404 ,message: "ไม่พบข้อมูล",data:null });
  }

  res.status(200).send({status:200 ,message: "ยืนยันสิทธิการใช้งานสำเร็จ",data:updateUser });
 } catch (error) {
  res.status(500).send({status:500 ,message: message.error,data:null });
  console.log(error);
 }})


module.exports = router;
