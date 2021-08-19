const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth.json')


module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization

    if(!authHeader){
        return res.status(401).send({ error: 'No token provided' }) // Verificação Header, caso 'Authorization' esteja incorreto, retornará erro
    }

    const parts = authHeader.split(' ')

    if(!parts.length === 2){
        return res.status(401).send({ error: 'Token error' }) // Verifica se o Token está em duas partes: Bearer + Token
    }

    const [ scheme, token ] = parts

    if(!/^Bearer$/i.test(scheme)){
        return res.status(401).send({ error: 'Token malformatted' }) // Verifica se contém o 'Bearer', caso não tenha, retornará erro
    }

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if(err) {
            return res.status(401).send({ error: 'Token invalid' }) // Verifica se o Token é valido, caso um dígito esteja incorreto, retornará erro
        }

        req.userId = decoded.id
        return next()
    })
}