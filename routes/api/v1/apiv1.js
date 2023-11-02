import express from 'express';
import fetch from 'node-fetch';
import { parse } from 'node-html-parser';

var router = express.Router();

router.get('/urls/preview', async (req, res) => {
    const url = req.query.url;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            res.status(400).send('Failed to fetch URL');
            return;
        }

        const htmlContent = await response.text();
        const root = parse(htmlContent);

        const ogData = {
            url: req.query.url,
            title: root.querySelector('meta[property="og:title"]')?.attributes.content || root.querySelector('title')?.text || req.query.url,
            image: root.querySelector('meta[property="og:image"]')?.attributes.content || '',
            description: root.querySelector('meta[property="og:description"]')?.attributes.content || '',
            pubDate: root.querySelector('meta[property="article:published_time"]')?.attributes.content || '',
            author: root.querySelector('meta[property="article:author"]')?.attributes.content || ''
        };

        // Create the HTML string for the preview box
        const previewHTML = `
            <div style="max-width: 500px; border: 1px solid; padding: 10px; margin-top: 20px; text-align: center; background-color: beige; border-radius: 5%;">
                <a href="${ogData.url}" target="_blank" style="display:block; margin: 10px 0;">
                    <h2 style="font-size: 14px;">${ogData.title}</h2>
                </a>
                ${ogData.pubDate ? `<p style="font-size: 12px; color: #777;">Published: ${ogData.pubDate}</p>` : ''}
                ${ogData.author ? `<p style="font-size: 12px; color: #777;">Author: ${ogData.author}</p>` : ''}
                ${ogData.image ? `<img src="${ogData.image}" alt="Preview Image" style="max-width: 70%; display: block; margin: 0 auto;">` : ''}
                <div style="margin-top: 16px;">
                    ${ogData.description ? `<p>${ogData.description}</p>` : ''}
                </div>
            </div>
        `;
      
        res.send(previewHTML);
    } catch (error) {
        res.status(500).send('Error fetching URL preview');
    }
});

export default router;
