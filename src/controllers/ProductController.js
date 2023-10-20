const { PrismaClient } = require('@prisma/client')
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const prisma = new PrismaClient()

module.exports = {
  async getProductsByStockId(req, res) {
    var stockId = parseInt(req.params.id);

    if (!isNaN(stockId)) {
      const findProductsByStockId = await prisma.produto.findMany({
        where: {
          id_stock: stockId
        },
        include: {
          supplier: true
        }
      });

      const findStockById = await prisma.estoque.findUnique({
        where: {
          id_es: stockId
        }
      });
      // console.log(findStockById)

      let valor_estoque = 0
      let investimento  = 0     
      // const valor_produto      = findProductsByStockId.map(produto => produto.valor)
      // const quantidade_produto = findProductsByStockId.map(produto => produto.quantidade)

      for (let i = 0; i < findProductsByStockId.length; i++) {
        valor_estoque = valor_estoque + (findProductsByStockId[i].valor * findProductsByStockId[i].quantidade)
        investimento  = investimento + (findProductsByStockId[i].custo * findProductsByStockId[i].quantidade)
      }
      // console.log(valor_estoque)
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
        res.render('modelo', {
          produtos: findProductsByStockId,
          nome_estoque: findStockById.nome_es,
          id_estoque: findStockById.id_es,
          valor_estoque: valor_estoque,
          investimento: investimento,
          counter: counter
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

        // console.log(stockId)
        res.render('addProduto', {
          forn_success: forn_success,
          suppliers: findSuppliers,
          id_estoque: stockId,
          counter: counter
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
      var quantidade = fields['quantidade']
      var valor = fields['valor']
      var custo = fields['custo']

      var nomeimg = ""
      if (files.imagem['originalFilename'].length != 0) {
        var oldpathImg = files.imagem.filepath
        var hashImg = crypto.createHash('md5').update(Date.now().toString()).digest('hex')
        nomeimg = hashImg + '.' + files.imagem.mimetype.split('/')[1]
        var newpathImg = path.join(__dirname, '../../public/produtos/', nomeimg)
        fs.rename(oldpathImg, newpathImg, function (err) {
          if (err) throw err
        })
      }


      const createProduct = await prisma.produto.create({
        data: {
          id_stock: parseInt(stockId),
          id_supply: parseInt(id_supply),
          nome_prod: nome_produto,
          categoria: categoria_produto,
          quantidade: parseInt(quantidade),
          valor: parseFloat(valor),
          custo: parseFloat(custo),
          imagem: nomeimg,
        },
      })
      // console.log(createProduct)
      req.session.product_success = "Produto cadastrado."
      res.redirect('/estoques')
    })
  },

  // Increase Product Quantity
  async increaseOne(req, res) {
    const productId = parseInt(req.params.id)
    var form_product_update_increase = new formidable.IncomingForm()


    if (req.session.logado === true) {
      if (!isNaN(productId)) {

        const findProductById = await prisma.produto.findUnique({
          where: {
            id_prod: productId
          }
        })

        form_product_update_increase.parse(req, async (err, fields, files) => {
          await prisma.produto.update({
            where: {
              id_prod: productId
            },
            data: {
              quantidade: (findProductById.quantidade + 1)
            }
          })
        })        

        req.session.product_update = "Produto atualizado."
        res.redirect(`/estoques`)
      }
    } else {
      req.session.login_warning = "Realize o login para ter acesso a esse serviço!"
      res.redirect('/login')
    }
  },

  // Decrease Product Quantity
  async decreaseOne(req, res) {
    const productId = parseInt(req.params.id)
    var form_product_update_increase = new formidable.IncomingForm()


    if (req.session.logado === true) {
      if (!isNaN(productId)) {

        const findProductById = await prisma.produto.findUnique({
          where: {
            id_prod: productId
          }
        })

        form_product_update_increase.parse(req, async (err, fields, files) => {
          await prisma.produto.update({
            where: {
              id_prod: productId
            },
            data: {
              quantidade: (findProductById.quantidade - 1)
            }
          })
        })

        req.session.product_update = "Produto atualizado."
        res.redirect(`/estoques`)
      }
    } else {
      req.session.login_warning = "Realize o login para ter acesso a esse serviço!"
      res.redirect('/login')
    }
  },

  // Get Update Product Form
  async getUpdateProductForm(req, res) {
    const productId = parseInt(req.params.id)

    if (!isNaN(productId)) {
      const findProductById = await prisma.produto.findUnique({
        where: {
          id_prod: productId
        },
      })

      const findSuppliers = await prisma.fornecedor.findMany()

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

      res.render('editaProduto', {
        produto: findProductById,
        suppliers: findSuppliers,
        counter: counter
      })
    } else {
      res.status(400).send('ID de produto inválido');
    }
  },

  // Update Product
  async updateProduct(req, res) {
    const productId = parseInt(req.params.id)
    var form_update_product = new formidable.IncomingForm()

    if (!isNaN(productId)) {

      form_update_product.parse(req, async(err, fields, files) => {
        var nome_produto = fields['nome']
        var custo = fields['custo']
        var valor = fields['valor']
        var quantidade = fields['quantidade']
        var id_fornecedor = fields['fornecedor']
        var id_estoque = fields['estoque']

        var nomeimg = ""
        if (files.imagem['originalFilename'].length != 0) {
          var oldpathImg = files.imagem.filepath
          var hashImg = crypto.createHash('md5').update(Date.now().toString()).digest('hex')
          nomeimg = hashImg + '.' + files.imagem.mimetype.split('/')[1]
          var newpathImg = path.join(__dirname, '../../public/produtos/', nomeimg)
          fs.rename(oldpathImg, newpathImg, function (err) {
            if (err) throw err
          })
        }

        await prisma.produto.update({
          where: {
            id_prod: productId
          }, 
          data: {
            nome_prod: nome_produto,
            custo: parseFloat(custo),
            valor: parseFloat(valor),
            quantidade: parseInt(quantidade),
            imagem: nomeimg,
            id_stock: parseInt(id_estoque),
            id_supply: parseInt(id_fornecedor)
          }
        })

        const createMovement = await prisma.movimentacao.create({
          data: {
            id_estoque: stockId,
            operacao: `${findStockById.nome_es} foi alterado.`,
          }
        })
      })

      req.session.product_update = "Produto atualizado."
      res.redirect(`/estoques`)
    } else {
      res.status(400).send('ID de produto inválido');
    }
  },

  // Delete Product
  async deleteProduct(req, res) {
    const productId = parseInt(req.params.id)

    if(!isNaN(productId)) {
      await prisma.produto.delete({
        where: {
          id_prod: productId
        }
      })
      req.session.product_update = "Produto excluído."
      res.redirect(`/estoques`)
    } else {
      res.status(400).send('ID de produto inválido');
    } 
  } 
}