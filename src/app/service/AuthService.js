const { BadRequestException, NotFoundException } = require('../../config/errors')
const User = require('../models/User')
const mailer = require('../../modules/mailer')
const authConfig = require('../../config/auth.json')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('../../database')


class AuthService {
    constructor(repository) {
        this.repository = repository
    }

    async generateToken(params){
        return jwt.sign(params, authConfig.secret, { // Função gerar Token
            expiresIn: 86400
        })
    }

    async register({ name, email, password }) {

            if (await User.findOne({ email })) {
                throw new BadRequestException('User already exists') // Se o email tentar ser registrado pela 2° vez, retornará erro
            }
    
        const user = await User.create({ name, email, password })
    
        user.password = undefined

        return user
    }

    async authenticate ({email, password}) {
 
        const user = await User.findOne({ email }).select('+password')
    
            if (! await user) {
                throw new NotFoundException('User not found') // Verificação se usuário existe
            }
    
            if (! await bcrypt.compare(password, user.password)) {
                throw new BadRequestException('Invalid password') // Verificação de senha com bcrypt
            }
    
        user.password = undefined
    
        return({ user })
    }

    async forgot_password ({ email }) {

        const user = await User.findOne({ email })

        if (!user) {
            throw new NotFoundException('User not found') // Verificação se usuário existe
        }

        const token = crypto.randomBytes(20).toString('hex')

        const now = new Date()
        now.setHours(now.getHours() + 1)

        await User.findByIdAndUpdate(user.id, {      // Atualiza o 'token de recuperação' de senha e 'data de expiração do token'
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now
            }
        })
        
        mailer.sendMail({                           // Disparar email para o mailtrap
            to: email,
            from: 'gabriel@hotmail.com',
            template: 'auth/forgot_password',
            context: { token },
        }, (err) => {

            if(err) {
                console.log(err)
                return 'Cannot send forgot email password'
            }

        })
        console.log({token, now})

    }
    
    async reset_password ({ email, token, password }) {

        const user = await User.findOne({ email }).select('+password passwordResetToken passwordResetExpires')
    
            if (!user) {
                throw new NotFoundException('User not found') // Verificação se usuário existe
            }
    
            if (token !== user.passwordResetToken) {
                throw new BadRequestException('Invalid token') // Verificação se token é válido
            }
    
        const now = new Date()
    
            if(now > user.passwordResetExpires) {
                throw new BadRequestException('Token expired, generate a new one')  // Verificação caso token esteja expirado           
            }
    
        user.password = password
    
        await user.save()    
    }
}

module.exports = AuthService