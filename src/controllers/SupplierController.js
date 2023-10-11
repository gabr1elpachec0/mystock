const { PrismaClient } = require('@prisma/client')
const formidable = require('formidable')

const prisma = new PrismaClient()

module.exports = {
  // Get Create Supplier Form
  async getCreateSupplierForm(req, res) {
    var forn_error

    if (req.session.forn_error) {
      forn_error = req.session.forn_error
      req.session.forn_error = ""
    }
    if (req.session.logado === true) {
      res.render('addForn', {
        forn_error: forn_error
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
        res.redirect('/estoques')
      }
    })
  }
}
