
const https = require('https');
const fs = require('fs');




// Set the host to use for the session:
const host = 'your-host-name';
const xrfkey = 'aaaaaaaaaaaaaaaa';


module.exports = sendWarning = function(taskId) {
    return new Promise((resolve, reject) => {
        //Configure parameters for the session request
        const options = {
            hostname: host,
            port: 4242,
            path: `/qrs/task/${taskId}/start?xrfkey=${xrfkey}`,
            method: 'POST',
            headers: {
                'X-qlik-xrfkey': `${xrfkey}`,
                'Content-Type': 'application/json',
                'X-Qlik-User': 'UserDirectory=INTERNAL; UserId=sa_repository'
            },
            key: fs.readFileSync("./certs/client_key.pem"),
            cert: fs.readFileSync("./certs/client.pem"),
            ca: fs.readFileSync("./certs/root.pem"),
            rejectUnauthorized: false
        };
        let sessionreq = https.request(options, function (sessionres) {
            console.log("statusCode: ", sessionres.statusCode, " Reload task started.");

            sessionres.on('data', function (d) {
                //Parse response
                let response = JSON.parse(d.toString());
                console.log(d.toString());
            });
        });


        let jsonrequest = JSON.stringify({});

        sessionreq.write(jsonrequest);
        sessionreq.end();

        sessionreq.on('error', function (e) {
            console.error('Error' + e);
        resolve();
        });
    });
};
