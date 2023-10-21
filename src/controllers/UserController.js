const { PrismaClient } = require('@prisma/client')
const formidable = require('formidable')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const saltRounds = 10

const prisma = new PrismaClient()

module.exports = {
  // Sign Up Method
  async createUser(req, res) {
    var form_cadastro = new formidable.IncomingForm()

    form_cadastro.parse(req, async (err, fields, files) => {
      var email = fields['email']
      var nome = fields['nome']
      const findUserByEmail = await prisma.usuario.findUnique({
        where: {
          email: email
        }
      })
      if (err) throw err
      if (findUserByEmail) {
        req.session.erro_cadastro = "E-mail já cadastrado."
        res.redirect('/cadastro')
      } else {
        var hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex')
        bcrypt.hash(fields['senha'], saltRounds, async (err, hash) => {
          await prisma.usuario.create({
            data: {
              email: email,
              nome_us: nome,
              senha: hash
            }
          })
        })
        req.session.sucesso = "Usuário cadastrado."
        res.redirect('/login')
      }
    })
  },
  
  // Login Method
  async loginUser(req, res) {
    var form_login = new formidable.IncomingForm()

    form_login.parse(req, async (err, fields, files) => {
      var email = fields['email']
      var senha = fields['senha']
      const findUserByEmail = await prisma.usuario.findUnique({
        where: {
          email: email
        }
      })
      // console.log(findUserByEmail)
      if (err) throw err
      if (findUserByEmail) {
        const senha_usuario = findUserByEmail.senha
        bcrypt.compare(senha, senha_usuario, async function (err, result) {
          if (err) throw err
          if (result) {
            req.session.logado = true
            req.session.userId = findUserByEmail.id_us
            // console.log(req.session.userId)
            req.session.email = findUserByEmail.email
            req.session.userName = findUserByEmail.nome_us
            var nome_usuario = findUserByEmail.nome_us
            req.session.sucesso_login = nome_usuario + ', seja bem-vindo(a)!'

            res.redirect('/home')
            // console.log('logado')

          } else {
            req.session.erro_login = "Email ou senha inválidos!"
            res.redirect('/login')
          }
        })
      } else {
        req.session.erro_login = "Email ou senha inválidos!"
        res.redirect('/login')
      }
    })
  },

  // Open login form
  async getLoginForm(req, res) {
    var sucesso
    var erro_login
    var login_warning

    if (req.session.sucesso) {
      sucesso = req.session.sucesso
      req.session.sucesso = ""
    }
    if (req.session.erro_login) {
      erro_login = req.session.erro_login
      req.session.erro_login = ""
    }
    if (req.session.login_warning) {
      login_warning = req.session.login_warning
      req.session.login_warning = ""
    }

    res.render('login', { sucesso: sucesso, erro_login: erro_login, login_warning: login_warning })
  },

  // Open sign up form
  async getSignUpForm(req, res) {
    var erro_cadastro
    if (req.session.erro_cadastro) {
      erro_cadastro = req.session.erro_cadastro
      req.session.erro_cadastro = ""
    }

    res.render('cadastro', { erro_cadastro: erro_cadastro })
  },

  // User logout
  async userLogout(req, res) {
    if (req.session.logado === true) {
      req.session.logado = false
      req.session.logout = "Você se desconectou da plataforma, faça o login!"
    }

    res.redirect('home')
  },

  // Get profile data
  async getProfile(req, res) {
    if (req.session.logado === true) {
      const userId = req.session.userId

      const findUserById = await prisma.usuario.findUnique({
        where: {
          id_us: userId
        }
      })

      const findStocksByUserId = await prisma.estoque.findMany({
        where: {
          id_user: userId
        }
      })
      
      const lengthStocks = findStocksByUserId.length

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

      res.render('conta', {
        id_user: findUserById.id_us,
        usuario: [findUserById],
        estoques: lengthStocks,
        counter: counter
      })
    } else {
      req.session.login_warning = "Realize o login para ter acesso a esse serviço!"
      res.redirect('login')
    }
  },

  // Get Update User Form
  async getUpdateUserForm(req, res) {
    if (req.session.logado === true) {
      const userId = req.session.userId

      const findUserById = await prisma.usuario.findUnique({
        where: {
          id_us: userId
        }
      })

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

      res.render('editarPerfil', {
        usuario: [findUserById],
        counter: counter
      })
    } else {
      req.session.login_warning = "Realize o login para ter acesso a esse serviço!"
      res.redirect('login')
    }
    
  },

  // Update User
  async updateUser(req, res) {
    const userId = req.session.userId

    var form_update_user = new formidable.IncomingForm()

    form_update_user.parse(req, async(err, fields, files) => {
      var nome_usuario = fields['nome']
      var email_usuario = fields['email']
      var hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex')

      bcrypt.hash(fields['senha'], saltRounds, async (err, hash) => {
        await prisma.usuario.update({
          where: {
            id_us: userId
          },
          data: {
            email: email_usuario,
            nome_us: nome_usuario,
            senha: hash
          }
        })
      })
      req.session.sucesso = "Usuário atualizado."
      res.redirect('/login')
    })
  }
}