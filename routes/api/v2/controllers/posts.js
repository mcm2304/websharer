import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

router.post('/', async function(req, res, next){
    try {
        console.log('Received POST request with data:', req.body);
        const { url, username, description, created_date } = req.body;

        let post = new req.models.Post({
            url: url,
            username: username,
            description: description,
            time: created_date,
        })
    
        await post.save();
        res.json({'status': 'success'})
    } catch(error) {
        console.log(error);
        res.status(500).json({'status': 'error', 'error': error});
    }
})

router.get('/', async function(req, res, next){
    try {   
        let allPosts = await req.models.Post.find()

        let postData = await Promise.all(
            allPosts.map(async post => { 
                try{
                    return {
                        htmlPreview : await getURLPreview(post.url),
                        description: post.description,
                        username: post.username
                    }
                    
                } catch(error){
                    return {
                        htmlPreview : error || "An error occurred while generating the preview",
                        description: post.description,
                        username: post.username
                    }
                }
            })
        );

        res.send(postData)
    } catch(error) {
        console.log(error);
        res.status(500).json({'status': 'error', 'error': error});
    }
})

export default router;