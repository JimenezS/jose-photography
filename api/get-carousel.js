import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    // Path to your engagement images folder
    const dirPath = path.join(process.cwd(), '', 'img', 'engagements'); 
    // Note: If your img folder is directly in the root, change 'public' to '' or remove it depending on your exact Vercel layout.

    try {
        if (!fs.existsSync(dirPath)) {
            // Fallback check if public folder isn't used
            const rootDirPath = path.join(process.cwd(), 'img', 'engagements');
            const files = fs.readdirSync(rootDirPath);
            const images = files.filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
            return res.status(200).json(images);
        }

        const files = fs.readdirSync(dirPath);
        const images = files.filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ error: 'Unable to scan image directory', details: error.message });
    }
}