'use strict'

const jwt = require('jwt-simple')
const moment = require('moment')

const secret = 'password'
var arrayC = []

exports.ensureAuth = function (req, res, next) {
    var params = req.body
    arrayC = params.commands.split(" ")

    if (!req.headers.authorization) {
        if (arrayC[0] == "login" || arrayC[0] == "register") {
            next()
        } else {
            return res.status(403).send({ message: 'La peticion no tiene la cabecera autenticacion' })
        }

    } else {

        var token = req.headers.authorization.replace(/['"]+/g, '')

        try {
            var payload = jwt.decode(token, secret)
            if (payload.exp <= moment.unix) {
                return res.status(401).send({ message: 'El token ha expirado' })
            }
        } catch (ex) {
            return res.status(404).send({ message: 'El token no es valido' })
        }
        req.user = payload
        next()
    }
}
