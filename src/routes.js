const { Router } = require('express')

const HomeController = require('./controllers/HomeController')
const UserController = require('./controllers/UserController')
const StockController = require('./controllers/StockController')
const ProductController = require('./controllers/ProductController')
const SupplierController = require('./controllers/SupplierController')

const router = Router()

// Home routes
router.get('/home', HomeController.getHome)

// User routes
router.get('/login', UserController.getLoginForm)
router.get('/cadastro', UserController.getSignUpForm)
router.get('/logout', UserController.userLogout)
router.post('/cadastro', UserController.createUser)
router.post('/login', UserController.loginUser)

// Stock routes
router.get('/paginaEstoque', StockController.getStockPage)
router.get('/estoques', StockController.getStocks)
router.get('/addEstoque', StockController.getCreateStockForm)
router.post('/estoque', StockController.createStock)
router.get('/editaEstoque/:id', StockController.getUpdateStockForm)
router.post('/editaEstoque/:id', StockController.updateStock)

// Product routes
router.get('/produtos/:id', ProductController.getProductsByStockId)
router.get('/addProduto/:id', ProductController.getCreateProductForm)
router.post('/addProduto', ProductController.createProduct)

// Supplier routes
router.get('/addForn', SupplierController.getCreateSupplierForm)
router.post('/addForn', SupplierController.createSupplier)

module.exports = router