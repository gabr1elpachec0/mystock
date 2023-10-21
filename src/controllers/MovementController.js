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
    let findProductsMovement = []
    let counter = 0

    for (let i = 0; i < findStocksByUserId.length; i++) {
      const findProductsByStockId = await prisma.produto.findMany({
        where: {
          id_stock: findStocksByUserId[i].id_es
        }
      })

      for (let j = 0; j < findProductsByStockId.length; j++) {
        const productMovements = await prisma.movimentacao_Produto.findMany({
          where: {
            id_produto: findProductsByStockId[j].id_prod
          }
        })
        findProductsMovement = findProductsMovement.concat(productMovements)
      } 

      const movements = await prisma.movimentacao_Estoque.findMany({
        where: {
          id_estoque: findStocksByUserId[i].id_es
        }
      });

      findMovement = findMovement.concat(movements);
    }

    const numberOfMovements = findMovement.length + findProductsMovement.length;

    counter += numberOfMovements;
    
    const formatedMovements = findMovement.map((movement) => ({
      ...movement,
      data: dayjs(movement.data).format('DD/MM/YYYY HH:mm')
    }))

    const formatedProductMovements = findProductsMovement.map((movement) => ({
      ...movement,
      data: dayjs(movement.data).format('DD/MM/YYYY HH:mm')
    }))

    // console.log(findMovement);
    // console.log(counter)

    res.render('movimentacao', {
      movement: formatedMovements,
      productsMovement: formatedProductMovements,
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

      const findProductsByStockId = await prisma.produto.findMany({
        where: {
          id_stock: findStocksByUserId[i].id_es
        }
      })

      for(let j = 0; j < findProductsByStockId.length; j++) {
        await prisma.movimentacao_Produto.deleteMany({
          where: {
            id_produto: findProductsByStockId[j].id_prod
          }
        })
      }

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