import jwt from 'jsonwebtoken'

// Accept a user object or id and sign a JWT with a consistent payload shape
const generateToken = (userOrId) => {
    const id = typeof userOrId === 'object' && userOrId !== null ? (userOrId._id || userOrId.id) : userOrId;
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' })
}

export default generateToken;