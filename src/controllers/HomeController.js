const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = {
  async getHome(req, res) {
    var sucesso_login
    var logado
    var logout

    if (req.session.sucesso_login) {
      sucesso_login = req.session.sucesso_login
      req.session.sucesso_login = ""
    }
    if (req.session.logado === true) {
      logado = req.session.logado
    }
    if (req.session.logout) {
      logout = req.session.logout
      req.session.logout = ""
    }

    res.render('home', { sucesso_login: sucesso_login, logado: logado, logout: logout })
  }
}