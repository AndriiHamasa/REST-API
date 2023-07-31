import HttpError from "../helpers/HttpError.js"

const isEmptyBody = (req, _, next) => {
    const { length } = Object.entries(req.body)
    if (length > 0) return next()
    throw HttpError(400, "missing fields")
}

export default isEmptyBody