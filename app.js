var express = require('express');
var app = express();
var faker = require('faker');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');

// =================== SETEOS ====================
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// ==================== BBDD ====================
// conexion
mongoose.connect("mongodb://localhost/productos");

// Schemas
var productoSchema = new mongoose.Schema({
	precio: Number,
	nombre: String, 
	descripcion: String,
	foto: String,
	reviews: Number
});

// Modelo
var Producto = mongoose.model("Producto", productoSchema)

// ==================== RUTAS RESTful ====================

app.get('/', function(req, res) {
	Producto.find({}, function(err, productos) {
		if(err) {
			console.log(err);
		} else {
			res.render('index', {productos: productos});
		}
	})
})

app.get('/productos/new', function(req, res) {
	res.render('agrega_producto');
});

app.get('/productos/:id', function(req, res) {

	Producto.findById(req.params.id, function(err, productoIndividual) {
		if(err) {
			console.log(err);
		} else {
			res.render('show', {producto: productoIndividual});
		}
	});

});

app.get('/productos/:id/edit', function(req, res) {
	Producto.findById(req.params.id, function(err, productoIndividual) {
		if(err) {
			console.log(err);
		} else {
			res.render('edit', {producto: productoIndividual});
		}
	});
}); 

app.post('/', function(req, res) {
	
	var nuevoProducto =	{
			precio: Number(req.body.precio_producto),
			nombre: req.body.nombre_producto,
			descripcion: req.body.descripcion_producto,
			foto: req.body.imagen_producto,
			reviews: Math.round(Math.random() * 100),
		}

	Producto.create(nuevoProducto, function(err, productoCreado) {
		if(err) {
			console.log(err);
		} else {
			res.redirect('/');
		}
	 });

});

app.put('/productos/:id/', function(req, res) {
	console.log(req.body);
	var productoEditado =	{
			precio: Number(req.body.precio_producto),
			nombre: req.body.nombre_producto,
			descripcion: req.body.descripcion_producto,
			foto: req.body.imagen_producto,
			reviews: Math.round(Math.random() * 100),
		}
	Producto.findByIdAndUpdate(req.params.id, productoEditado, function(err, productoEditado) {
		if(err) {
			console.log(err);
		} else {
			res.redirect('/productos/' + req.params.id);
		}
	});
});


// =============== ESCUCHAR PUERTO ===============
app.listen(3001, function() {
	console.log('WEBSTORE v3 EN PUERTO 3001');
})