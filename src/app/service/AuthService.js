const { BadRequestException, NotFoundException } = require('../../../../library/src/config/errors')
const User = require('../models/User')
require('../../database')
const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth.json')


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

    // async authenticate (req, res) {
    //     const { email, password } = req.body
    
    //     try {
    //         const user = await User.findOne({ email }).select('+password')
    
    //         if (!user) {
    //             res.status(400).send({error: 'User not found'}) // Verificação se usuário existe na database
    //         }
    
    //         if (! await bcrypt.compare(password, user.password)) {
    //             res.status(400).send({error: 'Invalid password'}) // Verificação de senha com bcrypt
    //         }
    
    //     user.password = undefined
    
    //     res.send({
    //         user,
    //         token: generateToken({ id: user.id }) // Retorna o usuário e gera um novo token
    //     })
    
    //     } catch (err) {
    //         res.status(400).send({error: 'Cannot authenticate'})        
    //     }
    
    // }
}

module.exports = AuthService