const { PrismaClient } = require('@prisma/client')
const formidable = require('formidable')

const prisma = new PrismaClient()

module.exports = {
  async getProductsByStockId(req, res) {
    var stockId = parseInt(req.params.id)
    console.log(stockId)

    const findProductsByStockId = await prisma.produto.findMany({
      where: {
        id_stock: stockId
      },
    })

    const findStockById = await prisma.estoque.findUnique({
      where: {
        id_es: stockId
      }
    })

    res.render('modelo', { 
      produtos: findProductsByStockId,
      nome_estoque: findStockById.nome_es
    })
  }
}