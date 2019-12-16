# Qlik Sense Engine Healthcheck API Logger
This JavaScript code utilizes the Qlik Sense Engine Health Check API to pull engine stats and dump them out to a log file.  It is designed to run in the background and will log stats every X minutes/seconds based on the timer interval setting.  It also utilizes the Qlik SMTP notification web connector to send emails when the RAM becomes saturated and when the CPU reaches a defined percentage utilization.


# Installation and Setup
There are five components that need to be installed and/or configured:
1. Install the Qlik Web Connectors and configure the SMTP connector;
2. Import into the QMC and configure the two email notification apps and the one results app;
3. Create the two reload tasks to reload the two notification apps;
4. Download, install, and configure the JavaScript code provided here;
5. Export the Qlik certificates from the QMC.


# Install the Qlik Web Connectors and configure the SMTP connector
The Qlik Web Connectors are available and can be downloaded from the Qlik.com download site.

For testing purposes, I used the Google SMTP server as my mail server.  Obviously you would use your internal SMTP server.  If you use Google for testing, below are the configuration settings:
Username: your Gmail email address
Password: your Gmail email account password
SMTP server: smtp..gmail.com
Port: 587
SSL Mode: Explicit
To: the email address where you want the notification ddelivered
Subject: subject line of the notification email
Message: body of the notification email
From Name: Qlik Sense Server (for example)
From Email: email address used to send the email

The remaining options can be left blank.

Click the Save Inputs & Run Table button and if all of your settings above are correct, you will see an OK status on
the Data Preview tab and the following code on the Qlik Sense (Legacy Mode) tab:

SMTPConnector_SendEmail:
LOAD
    status as SendEmail_status,
    result as SendEmail_result,
    filesattached as SendEmail_filesattached
FROM
[http://localhost:5555/data?connectorID=SMTPConnector&table=SendEmail&...&delayInSeconds=0&ignoreProxy=False&appID=]
(qvx);
// IMPORTANT: If, when loading the above script, you receive a 'Script Error' Dialog box with a 'Field Not Found'
// (or other) error, the first thing you should do is copy and paste the full request URL (i.e. the URL between the square [...]
// brackets IN THE QLIKVIEW / QLIK SENSE SCRIPT ERROR DIALOG) into a browser address bar and check the response.

The exact contents of the FROM URL will be based on the settings you provided.

If using Google, you will also need to turn on Less secure app access to your Google account.  This can be accomplished by logging into your Google account and selecting Security then Less secure app access.


# Import into the QMC and configure the two email notification apps and the one results app
In the Data Load Editor section of the two email notificaiton apps, the variables will need to be changed to reflect your SMTP settings.


# Create the two reload tasks to reload the two notification apps
Simply specify the name of the reload task, Send CPU Warning Email for example, and the name of the app (Warning Email - CPU).  Do this for both notification apps.


# Download, install, and configure the JavaScript code provided here
Download and extract the contents of the zip file from GitHub.  Open the folder in Visual Studio Code and in a new terminal window, type "npm install" to install the node modules needed to run this code.

In both the emailWarning.js and the engineHealthCheck.js files, add the hostname and virtual proxy if needed to communicate with the engine API.  Also, replace the RAM warning task and the CPU task GIUDs in the engineHealthCheck.js code (lines 65 and 70) with the correct
GUIDs from your environment.

The default CPU threshold is 91% or above.  If your needs are different, this can be changed in the engineHealthCheck.js file @ line 68.


# Export the Qlik certificates from the QMC
From the QMC, export the Qlik certificated in pem format and copy them to the certs folder in this project.


The code should be installed and configured on each server that is to be monitored.

To start the logging from the engine HealthCheck API, type "node monitor.js" in the Visual Studio Code terminal window.


# License
This code is provided "AS IS" without warranty of any kind.  Qlik support agreement does not cover support for this software.