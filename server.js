// Serveur d'application

// @Importation des modules
require("dotenv").config();
const express = require('express');
const http = require('http');
const {Server: SocketSever} = require('socket.io');
const socketIOModule = require('./controllers/sockets');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('path');
const produitRoutes = require('./routes/produit.routes');
const entreeRoutes = require('./routes/entree.routes');
const userDataRoutes = require('./routes/connectionData.routes');
const venteRoutes = require('./routes/vente.routes');
const assujettRoutes = require('./routes/assujetti.routes');
const ficheStockRoutes = require('./routes/ficheStock.routes');

const UserSession = require('./utils/session');
// Objet de session
const session = new UserSession(process.env.SESS_PATH);

// Création de l'applicarion express et du socket
const PORT = process.env.PORT || 8082;
const app = express();
const server = http.createServer(app);
socketIOModule(server);

// Ajout des fonctionnalités à l'application
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(cookieParser());

// React View
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(session.readSession);
app.use(session.getUserData);

/** Routing */
// Ajout des Middlewares pour les endpoints(Url)
app.use("/api/produits", produitRoutes);
app.use("/api/entrees", entreeRoutes);
app.use('/api/user', userDataRoutes);
app.use('/api/ventes', venteRoutes);
app.use('/api/assujetti', assujettRoutes);
app.use('/api/fiche_stocks', ficheStockRoutes);

// Erreurs
app.use("/api/*", (req, res, next) => {
	const err = new Error("Not found");
	err.status = 404;
	next(err);
});
app.use("/api/*", (error, req, res, next) => {
	res.status(error.status || 500);
	console.log(error);
	if (error.status === 403) {
		return res.sendFile(path.join(__dirname, 'client/build/index.html'));
	}
	res.json({
		message: error.message
	});
});

// Renvoie index html si route n'existe pas
app.use("*", (req, res) => {
    return res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// Demarrage du serveur
server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

// exports.server = server;