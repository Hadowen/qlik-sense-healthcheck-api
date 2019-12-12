
const healthCheck = require('./js/engineHealthCheck.js')

// This will return the engine stats every second.
setInterval(function() {
    healthCheck();
    }, 2000);
