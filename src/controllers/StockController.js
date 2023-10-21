const { PrismaClient } = require('@prisma/client')
const formidable = require('formidable')

const prisma = new PrismaClient()

module.exports = {

  // Get Stocks
  async getStocks(req, res) {
    var estoque_success
    var forn_success
    var product_success
    var product_update

    if (req.session.estoque_success) {
      estoque_success = req.session.estoque_success
      req.session.estoque_success = ""
    }

    if (req.session.forn_success) {
      forn_success = req.session.forn_success
      req.session.forn_success = ""
    }

    if (req.session.product_success) {
      product_success = req.session.product_success
      req.session.product_success = ""
    }

    if (req.session.product_update) {
      product_update = req.session.product_update
      req.session.product_update = ""
    }

    if (req.session.logado === true) {
      const userId = req.session.userId

      const findStocksByUserId = await prisma.estoque.findMany({
        where: {
          id_user: userId
        },
        include: {
          category: true
        }
      })

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

      const findCategories = await prisma.categoria.findMany()

      // console.log(findStockByUserId)
      
      // console.log(estoque)
      res.render('estoques',
        {
          estoques: findStocksByUserId,
          categorias: findCategories,
          estoque_success: estoque_success,
          forn_success: forn_success,
          product_success: product_success,
          product_update: product_update,
          counter: counter
        });
    } else {
      req.session.login_warning = "Realize o login para ter acesso a esse serviço!"
      res.redirect('login')
    }
  },

  // Get Stock Create Form
  async getCreateStockForm(req, res) {
    if (req.session.logado === true) {
      // const userName = req.session.userName
      // console.log(userId)
      // console.log(userName)
      const findCategories = await prisma.categoria.findMany()

      // if (findCategories) {
      //   console.log(findCategories)
      // }

      const userId = req.session.userId;


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

      res.render('addEstoque', {
        categorias: findCategories,
        counter: counter
      })
    } else {
      req.session.login_warning = "Realize o login para ter acesso a esse serviço!"
      res.redirect('login')
    }
  },

  // Create Stock
  async createStock(req, res) {
    const userId = req.session.userId

    var form_estoque_create = new formidable.IncomingForm()


    form_estoque_create.parse(req, async (err, fields, files) => {
      var nome_estoque = fields['nome']
      var id_categoria = fields['categoria']

      const novoEstoque = await prisma.estoque.create({
        data: {
          id_user: userId,
          id_categoria: parseInt(id_categoria),
          nome_es: nome_estoque,
        },
      })
      // console.log(novoEstoque)
      req.session.estoque_success = "Estoque cadastrado."
      res.redirect('/estoques')
    });
  },

  // Get Update Stock Form
  async getUpdateStockForm(req, res) {
    var stockId = parseInt(req.params.id)

    if (!isNaN(stockId)) {

      const findStockById = await prisma.estoque.findUnique({
        where: {
          id_es: stockId
        },
        include: {
          category: true
        }
      });
      // console.log(findStockById)

      const findCategories = await prisma.categoria.findMany()

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

      if (findStockById) {
        res.render('editaEstoque', {
          id_estoque: findStockById.id_es,
          nome_estoque: findStockById.nome_es,
          categoria_estoque: findStockById.category.id,
          categorias: findCategories,
          counter: counter
        })
      } else {
        res.status(404).send('Estoque não encontrado');
      }
    } else {
      res.status(400).send('ID de estoque inválido');
    }
  },

  // Update Stock
  async updateStock(req, res) {
    const stockId = parseInt(req.params.id)
    const userId = req.session.userId

    var form_estoque_update = new formidable.IncomingForm()

    if (!isNaN(stockId)) {
      form_estoque_update.parse(req, async (err, fields, files) => {
        var nome_estoque = fields['nome']
        var id_categoria = fields['categoria']

        await prisma.estoque.update({
          where: {
            id_es: stockId
          },
          data: {
            id_user: userId,
            id_categoria: parseInt(id_categoria),
            nome_es: nome_estoque,
          }
        })

        const findStockById = await prisma.estoque.findUnique({
          where: {
            id_es: stockId
          }
        })

        const createMovement = await prisma.movimentacao_Estoque.create({
          data: {
            id_estoque: stockId,
            operacao: `${findStockById.nome_es} foi alterado.`,
          }
        })

        // console.log('Método iniciou')

        req.session.estoque_success = "Estoque atualizado."
        res.redirect('/estoques');
      })
    } else {
      res.status(400).send('ID de estoque inválido');
    }
  },

  // Delete Stock
  async deleteStock(req, res) {
    const stockId = parseInt(req.params.id)

    if(!isNaN(stockId)) {
      await prisma.produto.deleteMany({
        where: {
          id_stock: stockId
        }
      })

      await prisma.movimentacao_Estoque.deleteMany({
        where: {
          id_estoque: stockId
        }
      })

      await prisma.estoque.delete({
        where: {
          id_es: stockId
        }
      })



      req.session.estoque_success = "Estoque excluído."
      res.redirect('/estoques');
    } else {
      res.status(400).send('ID de estoque inválido');
    }
  },

  // Filter Stocks

  async filterStocks(req, res) {
    const categoryId = parseInt(req.params.id)
    const userId = req.session.userId

    var estoque_success
    var forn_success
    var product_success
    var product_update

    if (req.session.estoque_success) {
      estoque_success = req.session.estoque_success
      req.session.estoque_success = ""
    }

    if (req.session.forn_success) {
      forn_success = req.session.forn_success
      req.session.forn_success = ""
    }

    if (req.session.product_success) {
      product_success = req.session.product_success
      req.session.product_success = ""
    }

    if (req.session.product_update) {
      product_update = req.session.product_update
      req.session.product_update = ""
    }

    if (!isNaN(categoryId)) {
      const findStocksByCategoryId = await prisma.estoque.findMany({
        where: {
          id_user: userId,
          id_categoria: categoryId
        },
        include: {
          category: true
        }
      })

      // console.log(findStocksByCategoryId)

      const findCategories = await prisma.categoria.findMany()

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

      res.render('estoquesFiltrados', {
        estoques: findStocksByCategoryId,
        categorias: findCategories,
        estoque_success: estoque_success,
        forn_success: forn_success,
        product_success: product_success,
        product_update: product_update,
        counter: counter
      })
    } else {
      res.status(400).send('ID de categoria inválido');
    }
  }

}