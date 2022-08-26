const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const credentials = require('./credentials.json');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file'];



const TOKEN_PATH = 'ya29.A0AVA9y1sffwyyA0Gz4D3JBwMFSOeomP5S3KcPi180b0eXulH5xCnv3Jj1UKQ4ZRZoyip84bTV3kOhJoBXvDPqla28KCji6ghsH6x7OYEncFM-ukf-rDqfThOcA_qESMjd3wKlxG3TfyicggurH8KPDpUNal8RaCgYKATASATASFQE65dr8sy4semRuEY11XeW5XuJVOQ0163';


listMajors();


// name: 'john',
//   age: '30',
//     email: 'johnbro21@gmail.com',
//       gender: 'male'

async function listMajors() {
  var client_secret = credentials && credentials.web && credentials.web.client_secret;
  var client_id = credentials && credentials.web && credentials.web.client_id;
  var redirect_uris = credentials && credentials.web && credentials.web.redirect_uris[0];

  const auth = new google.auth.OAuth2(client_id, client_secret, redirect_uris);
  auth.setCredentials({ access_token: TOKEN_PATH });

  const resource = {
    properties: {
      title: 'test 1',
    },
  };

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheet = await sheets.spreadsheets.create({
    resource,
    fields: 'spreadsheetId',
  });
  console.log(` ${spreadsheet.data.spreadsheetId}`);
}