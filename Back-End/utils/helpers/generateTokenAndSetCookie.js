import jwt from 'jsonwebtoken'

const generateTokenAndSetCookie = (userId,res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '15d',

    })
    res.cookie("jwt", token, {
        httpOnly: true, // this cookie can not be accessed by the browser meaning more secure
        maxAge: 15 * 24 * 60 * 60 * 1000,
        sameSite:"strict", // CSRF attack, CORS
    })
    return token;
}

export default generateTokenAndSetCookie;