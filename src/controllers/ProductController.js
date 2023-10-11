const { PrismaClient } = require('@prisma/client')
const formidable = require('formidable')

const prisma = new PrismaClient()

module.exports = {
  async getProductsByStockId(req, res) {
    var stockId = parseInt(req.params.id);

    if (!isNaN(stockId)) {
      const findProductsByStockId = await prisma.produto.findMany({
        where: {
          id_stock: stockId
        },
      });

      const findStockById = await prisma.estoque.findUnique({
        where: {
          id_es: stockId
        }
      });
      // console.log(findStockById)


      if (findStockById) {
        res.render('modelo', {
          produtos: findProductsByStockId,
          nome_estoque: findStockById.nome_es
        });
      } else {
        res.status(404).send('Estoque não encontrado');
      }
    } else {
      res.status(400).send('ID de estoque inválido');
    }
  }

}