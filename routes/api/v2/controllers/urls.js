import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

router.get('/preview', async function(req, res) {
    let route = await getURLPreview(req.query.url)
    res.type('html')
    res.send(route)
})

export default router;