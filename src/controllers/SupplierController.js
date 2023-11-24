const { PrismaClient } = require('@prisma/client')
const formidable = require('formidable')

const prisma = new PrismaClient()

module.exports = {
  // Get Create Supplier Form
  async getCreateSupplierForm(req, res) {
    var forn_error
    const stockId = parseInt(req.params.id)
    // console.log(stockId)

    if (req.session.forn_error) {
      forn_error = req.session.forn_error
      req.session.forn_error = ""
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

      res.render('addForn', {
        forn_error: forn_error,
        counter: counter,
        id_estoque: stockId
      })
    } else {
      req.session.login_warning = "Realize o login para ter acesso a esse serviço!"
      res.redirect('login')
    }
  },

  // Create Supplier
  async createSupplier(req, res) {
    var form_fornecedor_create = new formidable.IncomingForm()

    form_fornecedor_create.parse(req, async (err, fields, files) => {

      var fornname = fields['fornname']
      var fornemail = fields['fornemail']
      var forntel = fields['forntel']
      var stockId = fields['estoque']

      const findFornByEmail = await prisma.fornecedor.findUnique({
        where: {
          email_forn: fornemail
        }
      })
      if (err) throw err
      if (findFornByEmail) {
        req.session.forn_error = "Fornecedor já cadastrado."
        res.redirect('/addForn')
      } else {
        await prisma.fornecedor.create({
          data: {
            email_forn: fornemail,
            nome_forn: fornname,
            telefone: forntel
          }
        })
        req.session.forn_success = "Fornecedor cadastrado."
        res.redirect(`/addProduto/${parseInt(stockId)}`)
      }
    })
  }
}
