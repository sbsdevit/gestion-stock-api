// Functions and utilities about the socket users in communication

// user array
let users = [];

/**
 * New user connected
 * @param {string} id socket id
 * @param {string} numDef 
 * @param {string} userFonction 
 * @param {string} module 
 */
function newUser (id, numDef, userFonction, module) {
    // Create a new user object
    const user = {id, room: numDef, userFonction, module};
    // add user in the user array
    users.push(user);
    // return the user object
    return user;
}

/**
 * Gets a single user from user list by socket id
 * @param {string} id id of the socket
 * @returns user object
 */
function getUserById (id) {
    // get a user from the list
    const user = users.find(u => u.id === id);
    // return the user
    return user;
}

/**
 * remove the user from the user list
 * @param {string} id the socket id
 */
function removeUser (id) {
    // remove the user
    users = users.filter(u => u.id !== id);
}

// exports the functions
module.exports = {
    newUser, 
    getUserById,
    removeUser
}