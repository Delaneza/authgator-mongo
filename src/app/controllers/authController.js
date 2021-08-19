require('express').Router()
const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const mailer = require('../../modules/mailer')

const AuthService = require('../service/AuthService')
const authService = new AuthService()


// const authConfig = require('../../config/auth.json')

const User = require('../models/User')

module.exports = {

    async register (req, res) {
    const { name, email, password } = req.body

    const user = await authService.register({ name, email, password })
    const token = await authService.generateToken({ id: user.id })

       res.send({user, token}) 
    // res.send({
    //     user,
    //     token: generateToken({ id: user.id }) // Gerando um token para o novo usuário criado
    // })
    },

async authenticate (req, res) {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email }).select('+password')

        if (!user) {
            res.status(400).send({error: 'User not found'}) // Verificação se usuário existe na database
        }

        if (! await bcrypt.compare(password, user.password)) {
            res.status(400).send({error: 'Invalid password'}) // Verificação de senha com bcrypt
        }

    user.password = undefined

    res.send({
        user,
        token: generateToken({ id: user.id }) // Retorna o usuário e gera um novo token
    })

    } catch (err) {
        res.status(400).send({error: 'Cannot authenticate'})        
    }

},

async forgot_password (req, res) {
    const { email } = req.body

    try {
        const user = await User.findOne({ email })

        if(!user) {
            res.status(400).send({ error: 'User not found'})
        }

        const token = crypto.randomBytes(20).toString('hex')

        const now = new Date()
        now.setHours(now.getHours() + 1)

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now
            }
        })

        mailer.sendMail({
            to: email,
            from: 'gabriel@hotmail.com',
            template: 'auth/forgot_password',
            context: { token },

        })

        res.send()

    } catch(err) {
        res.status(400).send({error: 'Error on recover password, try again'})
    }
},

async reset_password (req, res) {
    const { email, token, password } = req.body

    try {
        const user = await User.findOne({ email }).select('+passwordResetToken passwordResetExpires')

        if (!user) {
            res.status(400).send({error: 'User not found'}) // Verificação se usuário existe na database
        }

        if (token !== user.passwordResetToken) {
            res.status(400).send({error: 'Invalid token'}) // Verificação se token é válido
        }

        const now = new Date()

        if(now > user.passwordResetExpires) {
            res.status(400).send({error: 'Token expired, generate a new one'}) // Verificação caso token esteja expirado           
        }

        user.password = password

        await user.save()

        res.send()

    } catch (err) {
        res.status(400).send({error: 'Cannot reset password, try again '})
    }
}
}
