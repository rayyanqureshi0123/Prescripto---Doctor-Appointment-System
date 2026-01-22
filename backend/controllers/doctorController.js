import doctorModel from "../models/doctorModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"


const changeAvailablity = async (req, res) => {
    try {
        const { docId } = req.body

        const docData = await doctorModel.findById(docId);
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'avaiablity changed' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//api for doctor login

const loginDoctor = async (req, res) => {

    try {

        const { email, password } = req.body
        const doctor = await doctorModel.findOne({ email })

        if (!doctor) {
            return res.json({ success: false, message: "invalid credentials" })

        }

        const isMatch = await bcrypt.compare(password, doctor.password)

        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)

            res.json({ success: true, token })
        } else {
            return res.json({ success: false, message: "invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//api to get doctor apppintments for doctor panel

const appointmentsDoctor = async (req, res) => {


    try {

        const docId = req.docId

        const appointments = await appointmentModel.find({ docId })

        res.json({ success: true, appointments })



    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


//api to marki appointment compelted

const appointmentCompelete = async (req, res) => {


    try {

        const { appointmentId } = req.body
        const docId = req.docId

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompeleted: true })
            return res.json({ success: true, message: "Appointment Compeleted" })
        } else {
            return res.json({ success: false, message: "mark failed" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// api to cancel appointment
const appointmentCancel = async (req, res) => {


    try {

        const { appointmentId } = req.body
        const docId = req.docId

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: "Appointment Canceled" })
        } else {
            return res.json({ success: false, message: "cancellation failed" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//api to get dashboard data for doctorpamel

const doctorDashboard = async (req, res) => {


    try {

        const docId = req.docId
        const appointments = await appointmentModel.find({ docId })

        let earnings = 0;

        appointments.map((item) => {
            if (item.isCompeleted || item.payment) {
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }

        res.json({ success: true, dashData })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//api to get dr profile

const doctorProfile = async (req, res) => {


    try {

        const docId = req.docId

        const profileData = await doctorModel.findById(docId).select('-password')
        res.json({ success: true, profileData })
    } catch (error) {

        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//api to update droctor profile

const updateDoctorProfile = async (req, res) => {

    try {

        const docId = req.docId

        const { fees, address, available } = req.body

        await doctorModel.findByIdAndUpdate(docId, { fees, address, available })

        res.json({ success: true, message: "Profile Updated" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    changeAvailablity, doctorList, loginDoctor,
    appointmentsDoctor, appointmentCompelete,
    appointmentCancel, doctorDashboard,
    doctorProfile, updateDoctorProfile
}
