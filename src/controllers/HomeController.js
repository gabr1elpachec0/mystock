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
    
    const userId = req.session.userId;

    const findStocksByUserId = await prisma.estoque.findMany({
      where: {
        id_user: userId
      }
    });

    let findMovement = []
    let counter = 0

    for (let i = 0; i < findStocksByUserId.length; i++) {
      const movements = await prisma.movimentacao_Estoque.findMany({
        where: {
          id_estoque: findStocksByUserId[i].id_es
        }
      });

      findMovement = findMovement.concat(movements);
    }

    const numberOfMovements = findMovement.length;

    counter += numberOfMovements;

    res.render('home', { sucesso_login: sucesso_login, logado: logado, logout: logout, counter: counter })
  }
}