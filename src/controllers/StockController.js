const { PrismaClient } = require('@prisma/client')
const formidable = require('formidable')

const prisma = new PrismaClient()

module.exports = {
  // Get Stock Page
  async getStockPage(req, res) {
    if (req.session.logado === true) {
      res.render('paginaestoque')
    } else {
      req.session.login_warning = "Realize o login para ter acesso a esse serviço!"
      res.redirect('login')
    }
  },


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

      const findStockByUserId = await prisma.estoque.findMany({
        where: {
          id_user: userId
        }
      })
      
      // console.log(estoque)
      res.render('estoques',
        {
          estoques: findStockByUserId,
          estoque_success: estoque_success,
          forn_success: forn_success,
          product_success: product_success,
          product_update: product_update
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
      res.render('addEstoque')
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
      var categoria = fields['categoria']

      const novoEstoque = await prisma.estoque.create({
        data: {
          id_user: userId,
          nome_es: nome_estoque,
          categoria: categoria
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
        }
      });
      // console.log(findStockById)


      if (findStockById) {
        res.render('editaEstoque', {
          id_estoque: findStockById.id_es,
          nome_estoque: findStockById.nome_es,
          categoria: findStockById.categoria
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
        var categoria = fields['categoria']

        await prisma.estoque.update({
          where: {
            id_es: stockId
          },
          data: {
            id_user: userId,
            nome_es: nome_estoque,
            categoria: categoria
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
  }

}