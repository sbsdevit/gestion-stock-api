// Utilities helper for the socket communications
// 

/**
 * Creates a formated message to send
 * @param {string} message 
 * @param {object} data 
 * @return The message object
 */
function formatedMessage (module, message, data) {
    const date = Date.now();

    return {
        module,
        message,
        data,
        date
    }
}

module.exports = {
    formatedMessage
}