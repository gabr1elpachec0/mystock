const { PrismaClient } = require('@prisma/client')
const formidable = require('formidable')
const crypto = require('crypto')
const bcrypt = require('bcrypt')

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
  }
}