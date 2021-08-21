require('express').Router()

const AuthService = require('../service/AuthService')
const authService = new AuthService()

module.exports = {

    async register (req, res) {
        const { name, email, password } = req.body

        const user = await authService.register({ name, email, password })
        const token = await authService.generateToken({ id: user.id })

       res.send({ user, token }) 
    },

    async authenticate (req, res) {
        const { email, password } = req.body

        const user = await authService.authenticate({email, password})
        const token = await authService.generateToken({ id: user.id })

        res.send({ user, token })
    },

    async forgot_password (req, res) {
        const { email } = req.body

        await authService.forgot_password({ email })

        res.send(`Please check your mailbox! A recovery token has been sent to ${email} `)
    },

    async reset_password (req, res) {
        const { email, token, password } = req.body

        await authService.reset_password({ email, token, password })

        res.send('Password changed!')
    }
}