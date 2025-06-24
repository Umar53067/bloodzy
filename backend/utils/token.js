import jwt from 'jsonwebtoken'

const generateToken = (userId)=>{
    return jwt.sign({userId}, 'jwt-secret-key', {expiresIn: '1d'})
}

export default generateToken;