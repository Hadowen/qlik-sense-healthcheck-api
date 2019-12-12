
const https = require('https');
const fs = require('fs');
const os = require('os');
const dayjs = require('dayjs');
const sendWarning = require('./emailWarning.js')

// Set the host to use for the session:
const host = 'your-host-name';


//Configure parameters for the session request
const options = {
    hostname: host,
    port: 4747,
    path: '/engine/healthcheck/',
    method: 'GET',
    headers: {
        'X-Qlik-User' : 'UserDirectory= INTERNAL; UserId= sa_engine'
    },
    key: fs.readFileSync("./certs/client_key.pem"),
    cert: fs.readFileSync("./certs/client.pem"),
    ca: fs.readFileSync("./certs/root.pem")
};


module.exports =
    function healthCheck() {
    https.get(options, (res) => {
    //console.log("Got response: " + res.statusCode);
    res.on("data", (chunk) => {
        //console.log("Request RESPONSE: " + chunk);
        let info = JSON.parse(chunk);
        fs.appendFile('EngineHealthCheck.txt',
                `${dayjs().format('YYYY-MM-DD hh:mm:ss')} `
                    + (!info.saturated? `INFO`: `WARN`) + ` `
                    + info.version + ` `
                    + info.started + ` `
                    + info.mem.committed + ` `
                    + info.mem.allocated + ` `
                    + info.mem.free + ` `
                    + info.cpu.total + ` `
                    + info.session.active + ` `
                    + info.session.total + ` `
                    + info.apps.active_docs.length + ` `
                    + info.apps.in_memory_docs.length + ` `
                    + info.apps.loaded_docs.length + ` `
                    + info.apps.calls + ` `
                    + info.apps.selections + ` `
                    + info.users.active + ` `
                    + info.users.total + ` `
                    + info.cache.hits + ` `
                    + info.cache.lookups + ` `
                    + info.cache.added + ` `
                    + info.cache.replaced + ` `
                    + info.cache.bytes_added + ` `
                    + info.saturated
                    + os.EOL, function(err){
            if(err) {
                return console.log(err);
            }
        });
        if(info.saturated) {
            // GUID for the RAM email task:
            sendWarning('2b378e37-0a44-4b40-98aa-b8240ec254b0');
        };
        // This will send an email when the CPU % is greater than 90%:
        if(info.cpu.total > 90) {
            // GUID for the CPU email task:
            sendWarning('55b2253a-cc1b-4a5d-a19f-2a85ff030618');
        };
        console.log(`${dayjs().format('YYYY-MM-DD hh:mm:ss')} ` + info.mem.free +
                '  Active Users: ' + info.users.active +
                '  Total Users: ' + info.users.total);
    });

    }).on('error', (e) => {
        console.log("Got error: " + e.message);
    })
};
