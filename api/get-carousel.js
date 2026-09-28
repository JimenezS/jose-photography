import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    // Points to the bundled engagements folder
    const dirPath = path.join(process.cwd(), 'img', 'engagements');

    try {
        if (!fs.existsSync(dirPath)) {
            return res.status(404).json({ error: 'Directory not found', path: dirPath });
        }

        const files = fs.readdirSync(dirPath);
        // Filter for valid image formats
        const images = files.filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
        
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(images);
    } catch (error) {
        return res.status(500).json({ error: 'Unable to scan image directory', details: error.message });
    }
}