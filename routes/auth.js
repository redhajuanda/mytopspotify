const express = require('express')
const router = express.Router()
const request = require('request')
const querystring = require('querystring')
const Key = require('../models/keys')
const mongoose = require('mongoose')
const scopes = 'user-read-private user-read-email user-top-read user-library-read';

router.get('/login', function(req, res) {
    res.redirect('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&show_dialog=true' +
    '&client_id=' + process.env.MY_CLIENT_ID +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent(process.env.REDIRECT_URI));
});

router.get('/callback', (req, res) => {
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: req.query['code'],
            redirect_uri: process.env.REDIRECT_URI,
            grant_type: 'authorization_code'
        },
        headers: {
        'Authorization': 'Basic ' + (new Buffer.from(process.env.MY_CLIENT_ID + ':' + process.env.MY_CLIENT_SECRET).toString('base64'))
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {

            var access_token = body.access_token,
                refresh_token = body.refresh_token;
    
            var options = {
                url: 'https://api.spotify.com/v1/me',
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
            };
    
            // use the access token to access the Spotify Web API
            request.get(options, function(error, response, body) {
                
                // Save Token
                const key = new Key({
                    _id: new mongoose.Types.ObjectId(),
                    user: body.id,
                    access_token: access_token,
                    refresh_token: refresh_token
                })

                const query  = { user: body.id };
                update = {
                    access_token: access_token,
                    refresh_token: refresh_token
                },
                options = { upsert: true, new: true, setDefaultsOnInsert: true };
                Key.findOneAndUpdate(query, update, options, function(error, result) {
                    if (error) return handleError(err);
                    if (result) {
                        res.redirect('/artists/' +result.user);
                    }
                });
            });
        } else {
            res.redirect('/#' +
                querystring.stringify({
                error: 'invalid_token'
            }));
        }
    });
})

module.exports = router