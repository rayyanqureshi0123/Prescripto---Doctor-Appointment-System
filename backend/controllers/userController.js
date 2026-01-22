import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import razorpay from 'razorpay'

//API to register the user

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !password || !email) {
      return res.json({ success: false, message: "missing details" })

    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "enter an valid email" })
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "enter strong password" })
    }

    //hashing user password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const userData = {
      name,
      email,
      password: hashedPassword
    }

    const newUser = new userModel(userData)
    const user = await newUser.save()

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

    res.json({ success: true, token })


  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

//api for user login

const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body
    const user = await userModel.findOne({ email })

    if (!user) {
      return res.json({ success: false, message: 'user does not exist' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
      res.json({ success: true, token })
    } else {
      res.json({ success: false, message: "invalid credentials" })
    }


  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

//api to get user profile data

const getProfile = async (req, res) => {


  try {


    // const {userId}=req.body
    const userData = await userModel.findById(req.user.id).select('-password')
    res.json({ success: true, userData })



  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

//api to update uer profile

const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file; // ✅ multer gives this

    if (!name || !phone || !address || !dob || !gender) {
      return res.json({ success: false, message: "data missing" });
    }

    // parse dob safely
    let parsedDob = dob;
    if (dob) {
      parsedDob = new Date(dob); // ✅ convert to Date
      if (isNaN(parsedDob)) {
        return res.json({ success: false, message: "Invalid date format" });
      }
    }

    // update base info
    await userModel.findByIdAndUpdate(req.user.id, {
      name,
      phone,
      address: JSON.parse(address),
      gender,
      dob: parsedDob
    });

    // if image present, upload to cloudinary
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(req.user.id, { image: imageURL });
    }

    res.json({ success: true, message: "profile updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

//Api to book appointment

const bookAppointment = async (req, res) => {


  try {

    const userId = req.user.id;
    const { docId, slotDate, slotTime } = req.body

    const docData = await doctorModel.findById(docId).select('-password')

    if (!docData.available) {
      return res.json({ success: false, message: 'doctor not available' })
    }

    let slots_booked = docData.slots_booked

    //checking for slots avalilablity

    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: 'doctor not available' })
      } else {
        slots_booked[slotDate].push(slotTime)
      }
    } else {
      slots_booked[slotDate] = []
      slots_booked[slotDate].push(slotTime)
    }

    const userData = await userModel.findById(userId).select('-password')
    delete docData.slots_booked

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now()
    }

    const newAppointment = new appointmentModel(appointmentData)
    await newAppointment.save()

    //save new slots data in docdata

    await doctorModel.findByIdAndUpdate(docId, { slots_booked })

    res.json({ success: true, message: "appointment booked" })



  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

//api to get user appointments for frontend on my-appointments page

const listAppointment = async (req, res) => {


  try {
    // ✅ get userId from token (auth middleware sets req.user)
    const userId = req.user.id;

    const appointments = await appointmentModel
      .find({ userId })


    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

//api to cancel  appointment

const cancelAppointment = async (req, res) => {

  try {


    const userId = req.user.id;
    const { appointmentId } = req.body

    const appointmentData = await appointmentModel.findById(appointmentId)

    //verify appointment user

    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "unauthorized action" })


    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true }, { new: true })

    //relessing doctor slot

    const { docId, slotDate, slotTime } = appointmentData

    const doctorData = await doctorModel.findById(docId)

    let slots_booked = doctorData.slots_booked
    slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

    await doctorModel.findByIdAndUpdate(docId, { slots_booked })

    res.json({ success: true, message: "appointment cancelled" })


  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})



//api to make payment of appointment using userpay

const paymentRazorpay = async (req, res) => {

  try {


    const { appointmentId } = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({ success: false, message: "appointment cancelled or not found" })


    }

    //creating option for razorpay

    const options = {
      amount: appointmentData.amount * 100,
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    }

    //creation of an order

    const order = await razorpayInstance.orders.create(options)
    res.json({ success: true, order})


  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }


}

// API TO VERIFY THE PAYMENT OF RAZORPAY

const verifyRazorpay=async (req,res)=>{
  try {
    const {razorpay_order_id}=req.body
    const orderInfo=await razorpayInstance.orders.fetch(razorpay_order_id)

    // console.log(orderInfo)

    if(orderInfo.status === 'paid'){
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})

      res.json({success:true,message:"payment successful"})
    }else{
      res.json({success:false,message:"payment failed"})
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}



export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment,paymentRazorpay ,verifyRazorpay }