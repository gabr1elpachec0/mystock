const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const dayjs = require('dayjs')
const moment = require('moment')

module.exports = {

  async getMovement(req, res) {
    if (req.session.logado) {
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
        data: dayjs(movement.data).format('DD/MM/YYYY HH:mm:ss')
      }))

      const formatedProductMovements = findProductsMovement.map((movement) => ({
        ...movement,
        data: dayjs(movement.data).format('DD/MM/YYYY HH:mm:ss')
      }))

      function parseDate(dateString) {
        return moment(dateString, "DD-MM-YYYY HH:mm:ss");
      }

      let allMovements = formatedMovements.concat(formatedProductMovements)

      // Ordene o array combinado com base na data em ordem decrescente usando Moment.js
      allMovements.sort((a, b) => parseDate(b.data).isBefore(parseDate(a.data)) ? -1 : 1);

      // console.log(findMovement);
      // console.log(counter)

      res.render('movimentacao', {
        allMovements: allMovements,
        counter: counter,
        cleanMovement: cleanMovement
      });
    } else {
      req.session.login_warning = "Realize o login para ter acesso a esse serviço!"
      res.redirect('/login')
    }
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