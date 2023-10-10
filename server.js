const { PrismaClient } = require('@prisma/client')
const express = require('express')
const formidable = require('formidable')
const path = require('path')
const port = 3000
const app = express()
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const session = require('express-session')
const saltRounds = 10
const prisma = new PrismaClient()

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: false,
    saveUninitialized: true
}))

// Rotas

app.get('/home', function(req, res) {
    var sucesso_login 
    var logado
    var logout

    if (req.session.sucesso_login) {
        sucesso_login = req.session.sucesso_login
        req.session.sucesso_login = ""
    }
    if (req.session.logado === true) {
        logado = req.session.logado 
    }
    if (req.session.logout) {
        logout = req.session.logout
        req.session.logout = ""
    }

    res.render('home', { sucesso_login: sucesso_login, logado: logado, logout: logout })
})

app.get('/login', function(req, res) {
    var sucesso
    var erro_login
    var login_warning

    if(req.session.sucesso){
        sucesso = req.session.sucesso
        req.session.sucesso = ""
    }
    if(req.session.erro_login){
        erro_login = req.session.erro_login
        req.session.erro_login = ""
    }
    if (req.session.login_warning) {
        login_warning = req.session.login_warning
        req.session.login_warning = ""
    }

    res.render('login', {sucesso: sucesso, erro_login: erro_login, login_warning: login_warning})
})

app.get('/logout', function(req, res) {
    if (req.session.logado === true) {
        req.session.logado = false
        req.session.logout = "Você se desconectou da plataforma, faça o login!"
    }

    res.redirect('home')
})

app.get('/cadastro', function(req, res) {
    var erro_cadastro
    if(req.session.erro_cadastro){
        erro_cadastro = req.session.erro_cadastro
        req.session.erro_cadastro = ""
    }

    res.render('cadastro.ejs', {erro_cadastro: erro_cadastro})
})

app.get('/paginaestoque', function(req, res) {
    if (req.session.logado === true) {
        res.render('paginaestoque')
    } else {
        req.session.login_warning = "Realize o login para ter acesso a esse serviço!"
        res.redirect('login')
    }
})



app.get('/addproduto', function(req, res) {
    var forn_success

    if (req.session.forn_success) {
        forn_success = req.session.forn_success
        req.session.forn_success = ""
    }
    if (req.session.logado === true) {
        res.render('addproduto', { forn_success: forn_success })
    } else {
        req.session.login_warning = "Realize o login para ter acesso a esse serviço!"
        res.redirect('login')
    }
})

app.get('/addestoque/', function(req, res) {
    if (req.session.logado === true) {
        // const userName = req.session.userName
        // console.log(userId)
        // console.log(userName)
        res.render('addestoque')
    } else {
        req.session.login_warning = "Realize o login para ter acesso a esse serviço!"
        res.redirect('login')
    }
})

app.get('/addforn', function(req, res) {
    var forn_error

    if (req.session.forn_error) {
        forn_error = req.session.forn_error
        req.session.forn_error = ""
    }
    if (req.session.logado === true) {
        res.render('addforn', { forn_error: forn_error })
    } else {
        req.session.login_warning = "Realize o login para ter acesso a esse serviço!"
        res.redirect('login')
    }
})

app.get('/estoque/:id', async (req, res) => {
    var estoque_id = parseInt(req.params.id);
    console.log(estoque_id)

    const findEstoqueById = await prisma.estoque.findUnique({
        where: {
            id_es: estoque_id 
        }
    });

    if (findEstoqueById) {
        res.render('modelo', { estoque: [findEstoqueById] })
    } else {
        console.log("Estoque não encontrado")
    }
});



// Métodos

app.post('/cadastro', async(req, res) => {
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
})

app.post('/login', async(req, res) => {
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
                    console.log(req.session.userId)
                    req.session.email = findUserByEmail.email
                    req.session.userName = findUserByEmail.nome_us
                    var nome_usuario = findUserByEmail.nome_us
                    req.session.sucesso_login = nome_usuario + ', seja bem-vindo(a)!'

                    res.redirect('/home')
                    console.log('logado')
                    
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
})

app.post('/addforn', async(req, res) => {
    var form_fornecedor = new formidable.IncomingForm()

    form_fornecedor.parse(req, async (err, fields, files) => {
        var fornname = fields['fornname']
        var fornemail = fields['fornemail']
        var forntel = fields['forntel']
        const findFornByEmail = await prisma.fornecedor.findUnique({
            where: {
                email_forn: fornemail
            }
        })
        if (err) throw err
        if (findFornByEmail) {
            req.session.forn_error = "Fornecedor já cadastrado."
            res.redirect('/addforn')
        } else {
            await prisma.fornecedor.create({
                data: {
                    email_forn: fornemail,
                    nome_forn: fornname,
                    telefone: forntel
                }
            })
            req.session.forn_success = "Fornecedor cadastrado."
            res.redirect('/addproduto')            
        }
    })
})

app.post('/addestoque/', async (req, res) => {
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
  
  });

  app.get('/estoques', async (req, res) => {
    var estoque_success

    if(req.session.estoque_success) {
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
})

app.listen(port, () => {
    console.log('Servidor rodando.')
})