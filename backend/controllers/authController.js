import User from '../models/User.js'

export const singup= async(req, res)=>{
    console.log(req.body)
    try {
        const user = await User.create(req.body)
    } catch (error) {
        console.error("Server error")
        res.status(500).json({message: "Internal sever error"})
    }
}

export const login = () =>{
    try {
        
    } catch (error) {
        console.error("sever error")
        res.status(500).json({message : "Internal server error"})
    }
}