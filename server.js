const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require('cors');
const querystring = require('querystring');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/refresh', (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: 'http://127.0.0.1:5173/',
    clientId: '6727280b598f42f18646ee89b28a2568',
    clientSecret: '7c6cc3ca31fc42c086f995cf254ca873',
    refreshToken,
  });

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch(() => {
      res.sendStatus(400);
    });
});

app.post('/login', (req, res) => {
  const code = req.body.code;

  const spotifyApi = new SpotifyWebApi({
    redirectUri: 'http://127.0.0.1:5173/',
    clientId: '6727280b598f42f18646ee89b28a2568',
    clientSecret: '7c6cc3ca31fc42c086f995cf254ca873',
  });

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

app.listen(5174);
