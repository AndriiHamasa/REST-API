import mongoose from "mongoose";
import request from "supertest"
import "dotenv/config"

import app from "../../app.js"
import { token } from "morgan";
// import User from "../../models/user.js";

const { DB_HOST_TEST, PORT } = process.env

describe("test login route", () => {
    let server = null
    beforeAll(async() => {
        mongoose.connect(DB_HOST_TEST)
        server = app.listen(PORT)
    })

    afterAll(async() => {
        await mongoose.connection.close()
        server.close()
    })

    test('login with correct data', async() => {
        const loginData = {
            email: "andrii@gmail.com",
            password: "123456"
        }
        const { statusCode, body } = await request(app).post("api/auth/login").send(loginData)
        
        expect(statusCode).toBe(200)
        expect(body).toContain(token)
        // expect.stringContaining(string)
        expect(body.user.email).toBe(loginData.email)
        expect.stringContaining(body.user.email)
        expect.stringContaining(body.user.subscription)

        // const user = await User.findOne({ email: loginData.email })
        // expect(user.email).toBe(loginData.email)

    })
    
})