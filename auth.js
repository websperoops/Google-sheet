const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const credentials = require('./credentials.json');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file'];

const TOKEN_PATH = 'token.json';

fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content));
});

async function authorize(credentials) {
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris);

    // Check if we have previously stored a token.
    await fs.readFile(TOKEN_PATH, (err, token) => {
        oAuth2Client.setCredentials(JSON.parse(token));
        createSheet(oAuth2Client, token);
        if (err) return getNewToken(oAuth2Client);
    });
}


//USER CREATE THE SHEET------
async function createSheet(oAuth2Client, token) {
    oAuth2Client.setCredentials(JSON.parse(token));
    const resource = {
        properties: {
            title: 'test 22',
        },
    };
    const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });
    const spreadsheet = await sheets.spreadsheets.create({
        resource,
        fields: 'spreadsheetId',
    });

    const spreadsheet1 = sheets.spreadsheets.values.append({
        auth: oAuth2Client,
        spreadsheetId: `${spreadsheet.data.spreadsheetId}`,
        range: "Sheet1!A:B", //sheet name and range of cells
        valueInputOption: 'RAW',
        resource: {
            values: [
                ['xoxo', '12']
            ]
        }
    });
    console.log("1");
}

function getNewToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });

    console.log('Authorize this app by visiting this url:', authUrl);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here:', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error while trying to retrieve access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
        });
    });
}