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
router.get('/conta', UserController.getProfile)
router.get('/editarPerfil/:id', UserController.getUpdateUserForm)
router.post('/editarPerfil/:id', UserController.updateUser)


// Stock routes
router.get('/paginaEstoque', StockController.getStockPage)
router.get('/estoques', StockController.getStocks)
router.get('/addEstoque', StockController.getCreateStockForm)
router.post('/estoque', StockController.createStock)
router.get('/editaEstoque/:id', StockController.getUpdateStockForm)
router.post('/editaEstoque/:id', StockController.updateStock)
router.get('/excluiEstoque/:id', StockController.deleteStock)
router.get('/filtrar/:id', StockController.filterStocks)

// Product routes
router.get('/produtos/:id', ProductController.getProductsByStockId)
router.get('/addProduto/:id', ProductController.getCreateProductForm)
router.post('/addProduto', ProductController.createProduct)
router.post('/increaseOne/:id', ProductController.increaseOne)
router.post('/decreaseOne/:id', ProductController.decreaseOne)
router.get('/editaProduto/:id', ProductController.getUpdateProductForm)
router.post('/editaProduto/:id', ProductController.updateProduct)
router.get('/excluiProduto/:id', ProductController.deleteProduct)

// Supplier routes
router.get('/addForn', SupplierController.getCreateSupplierForm)
router.post('/addForn', SupplierController.createSupplier)

module.exports = router