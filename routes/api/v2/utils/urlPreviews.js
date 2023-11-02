import fetch from 'node-fetch';
import parser from 'node-html-parser';

async function getURLPreview(url) {
    try {
        const response = await fetch(url);
        const htmlContent = await response.text();
        const root = parser.parse(htmlContent);
        const metaTags = root.querySelectorAll('meta');

        function getMetaProperty(property) {
            const metaTag = metaTags.find(tag => tag.getAttribute('property') === property);
            return metaTag ? metaTag.getAttribute('content') : null;
        }

        const metaUrl = getMetaProperty('og:url') || url;
        const metaTitle = getMetaProperty('og:title') || root.querySelector('title')?.text || url;
        const metaImg = getMetaProperty('og:image') || null;
        const metaDesc = getMetaProperty('og:description') || null;
        const metaSite = getMetaProperty('og:site_name') || metaTitle;

        const html = `
            <div class="html-box" style="max-width: 500px; border: 1px solid; padding: 10px; margin: 20px; text-align: center; background-color: beige; border-radius: 20px;">
                <h1 class="meta-site">${metaSite}</h1>
                <a href="${metaUrl}" target="_blank">
                    <p><strong>${metaTitle}</strong></p>
                </a>
                ${metaImg ? `<img src="${metaImg}" style="max-height: 200px; max-width: 200px;">` : ''}
                ${metaDesc ? `<p style="padding-top: 10px;">${metaDesc}</p>` : ''}
            </div>
        `;

        return html;
    } catch (error) {
        console.error(error);
    }
}

export default getURLPreview;
