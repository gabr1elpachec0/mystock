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

    if (req.session.estoque_success) {
      estoque_success = req.session.estoque_success
      req.session.estoque_success = ""
    }

    if (req.session.logado === true) {
      const estoque = await prisma.estoque.findMany();
      // console.log(estoque)
      res.render('estoques',
        {
          estoques: estoque,
          estoque_success: estoque_success
        });
    } else {
      req.session.login_warning = "Realize o login para ter acesso a esse serviço!"
      res.redirect('login')
    }
  },

  // Get Stock Create Form
  async getStockCreateForm(req, res) {
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

    var form_estoque = new formidable.IncomingForm()


    form_estoque.parse(req, async (err, fields, files) => {
      var nome_estoque = fields['nome']

      const novoEstoque = await prisma.estoque.create({
        data: {
          id_user: userId,
          nome_es: nome_estoque
        },
      })
      console.log(novoEstoque)
      req.session.estoque_success = "Estoque cadastrado."
      res.redirect('/estoques')
    });
  },

  // Get Stock By Id
  async getStock(req, res) {
    var stockId = parseInt(req.params.id)
    const findStockById = await prisma.estoque.findUnique({
      where: {
        id_es: stockId
      }
    })

    console.log(stockId)
    console.log(findStockById)

    res.render('modelo', { estoque: [findStockById] })
  }
}