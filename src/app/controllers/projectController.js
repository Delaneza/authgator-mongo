const express = require('express')
const authMiddleware = require('../middlewares/auth')

const router = express.Router()

router.use(authMiddleware)

router.get('/', (req, res) => {
    res.send({ Ok: 'Token authenticated', user_id: req.userId }) // Rota para consulta de Token, saber se é valido ou não
})

module.exports = app => app.use('/projects', router)