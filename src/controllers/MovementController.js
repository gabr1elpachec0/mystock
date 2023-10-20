const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const dayjs = require('dayjs')

module.exports = {

  async getMovement(req, res) {
    const userId = req.session.userId;
    var cleanMovement

    if (req.session.cleanMovement) {
      cleanMovement = req.session.cleanMovement
      req.session.cleanMovement = ""
    }

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
    
    const formatedMovements = findMovement.map((movement) => ({
      ...movement,
      data: dayjs(movement.data).format('DD/MM/YYYY HH:mm')
    }))

    // console.log(findMovement);
    // console.log(counter)

    res.render('movimentacao', {
      movement: formatedMovements,
      counter: counter,
      cleanMovement: cleanMovement
    });
  },


  // Clean Movement

  async cleanMovement(req, res) {
    const userId = req.session.userId

    const findStocksByUserId = await prisma.estoque.findMany({
      where: {
        id_user: userId
      }
    });

    for (let i = 0; i < findStocksByUserId.length; i++) {
      await prisma.movimentacao_Estoque.deleteMany({
        where: {
          id_estoque: findStocksByUserId[i].id_es
        }
      });
    }

    req.session.cleanMovement = "Registros de movimentação limpos."
    res.redirect('/movimentacao')
  }


}