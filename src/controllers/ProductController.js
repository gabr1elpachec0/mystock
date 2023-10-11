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
          nome_estoque: findStockById.nome_es,
          id_estoque: findStockById.id_es
        });
      } else {
        res.status(404).send('Estoque não encontrado');
      }
    } else {
      res.status(400).send('ID de estoque inválido');
    }
  },

  // Get Create Product Form
  async getCreateProductForm(req, res) {
    var forn_success
    const stockId = parseInt(req.params.id)
    

    if (req.session.forn_success) {
      forn_success = req.session.forn_success
      req.session.forn_success = ""
    }
    
    if (req.session.logado === true) {
      const findSuppliers = await prisma.fornecedor.findMany()
      // console.log(findSuppliers)

      if (!isNaN(stockId)) {
        // console.log(stockId)
        res.render('addProduto', {
          forn_success: forn_success,
          suppliers: findSuppliers,
          id_estoque: stockId
        })
      }
      
    } else {
      req.session.login_warning = "Realize o login para ter acesso a esse serviço!"
      res.redirect('/login')
    }
  },

  // Create Product
  async createProduct(req, res) {
    var form_product_create = new formidable.IncomingForm()


    form_product_create.parse(req, async (err, fields, files) => {
      var nome_produto = fields['nome']
      var categoria_produto = fields['categoria']
      var id_supply = fields['fornecedor']
      var stockId = fields['estoque']

      const createProduct = await prisma.produto.create({
        data: {
          id_stock: parseInt(stockId),
          id_supply: parseInt(id_supply),
          nome_prod: nome_produto,
          categoria: categoria_produto
        },
      })
      // console.log(createProduct)
      req.session.product_success = "Produto cadastrado."
      res.redirect('/estoques')
    })
  }
}