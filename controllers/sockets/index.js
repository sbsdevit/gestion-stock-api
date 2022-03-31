const { Server } = require("socket.io");
const { newUser, getUserById, removeUser } = require("./user");
const { formatedMessage } = require("./helper");
const UserSession = require("../../utils/session");
const getDatabase = require("../../models/assujettiDb");
const { Op } = require("sequelize");

/**
 * Socket communication module
 * @param {*} server http ou https server
 */
module.exports = (server) => {
	// Sockets server
	const io = new Server(server, {
		cors: {
			origin: "*",
		},
	});

	// Connexion event
	io.on("connection", (socket) => {
		// console.log("Socket connected ", socket.id);

		// Connected user
		socket.on("connected", (data) => {
			// Retrieve data
			const { room, userFonction, module: module_name } = data;
			// Check if the data exist
			if (data && room && userFonction && module_name) {
				// Create the user
				const user = newUser(
					socket.id,
					room,
					userFonction,
					module_name
				);
				// add user to the room
				socket.join(user.room);
			}
		});

		// New produit event
		socket.on("new_produit", async ({ produitId }) => {
			const user = getUserById(socket.id);
			console.log(user);
			if (user && produitId) {
				try {
					const data = await getSingleProduit(user, produitId);
					// Emit a message to all the room participants (vente, stock)
					socket.broadcast
						.to(user.room)
						.emit(
							"new_added_product",
							formatedMessage(
								user.module,
								"nouveau produit",
								data
							)
						);
				} catch (err) {
					console.log(err);
				}
			}
		});

		// New entree
		socket.on("new_entree", async (produitId) => {
			// Get the user
			const user = getUserById(socket.id);
			if (user) {
				try {
					// user bd
					const bdName = UserSession.getBdName(user.room);
					const bd = getDatabase(bdName);
					const Prod = bd.produit;
					const Entree = bd.entree;
					// Get The produit and entrees
					const produit = await Prod.findAll({
						where: {
							id: produitId,
						},
						include: {
							model: Entree,
							where: {
								solde: { [Op.gt]: 0 },
							},
							required: false,
						},
					});
					// Emit a message to all the room participants (vente, stock)
					socket.broadcast
						.to(user.room)
						.emit(
							"new_entree",
							formatedMessage(
								user.module,
								"nouvelle entrée",
								produit
							)
						);
				} catch (err) {
					console.log(err);
				}
			}
		});

		// Disconnect event
		socket.on("disconnect", () => {
			removeUser(socket.id);
		});
	});
};

// Gets the produit object
async function getSingleProduit(user, produitId) {
	// user bd
	const bdName = UserSession.getBdName(user.room);
	const bd = getDatabase(bdName);
	const Prod = bd.produit;
	const Entree = bd.entree;
	// Get The produit and entrees
	const produit = await Prod.findOne({
		where: {
			id: produitId,
		},
		include: {
			model: Entree,
			where: {
				solde: { [Op.gt]: 0 },
			},
			required: false,
		},
	});

	return produit;
}
