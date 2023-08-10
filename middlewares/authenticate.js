import jwt from "jsonwebtoken"
import ctrlDecorator from "../decorators/ctrl-decorator.js"
import HttpError from "../helpers/HttpError.js"
import User from "../models/user.js"

const {JWT_SECRET} = process.env

const authenticate = async (req, res, next) => {
    const { authorization = "" } = req.headers
    const [bearer, token] = authorization.split(" ")
    if (bearer !== "Bearer") throw HttpError(401)
    
    try {
        const { id } = jwt.verify(token, JWT_SECRET)
        const user = await User.findById(id)
        if (!user || user.token === "no") throw HttpError(401)
        req.user = user
        next()
    } catch {
        throw HttpError(401)
    }
}

export default ctrlDecorator(authenticate)