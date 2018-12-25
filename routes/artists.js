const express = require("express")
const router = express.Router()
const fetch = require('node-fetch')
const Key = require('../models/keys')

router.get('/:user', (req, res) => {
    const query  = { user: req.params.user };
    Key.findOne(query, function(error, result) {
        if (error) return handleError(error);
        if (result) {
            console.log('User :'+result.user)
            fetch('https://api.spotify.com/v1/me/top/artists?limit=20',{
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+result.access_token
                }
            })
            .then((data)=>data.json())
            .then((json)=>{
                // res.send(JSON.stringify(json,null,4));
                res.render('index',{
                    title: 'Artists',
                    page: 'artists',
                    user: result.user,
                    items: json
                })
            })
            .catch((error)=> console.log(error))
        }
    });
})

module.exports = router