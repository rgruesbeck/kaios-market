import Database from '@withkoji/database';
import uuid from 'uuid';

export default function (app) {
    app.post('/sync', async (req, res) => {
        const recordId = uuid.v4();
        const recordBody = {
            date: req.body.date,
            data: req.body.data
        };

        const database = new Database();
        await database.set('posts', recordId, recordBody);

        res.status(200).json({
            success: true,
        });
    })


    app.get('/syncx', async (req, res) => {
        const database = new Database();
        const rawPosts = await database.get('posts');
        rawPosts.forEach(p => {
            database.delete('posts', p._id)
        })
        console.log(rawPosts.length)
    })

    app.get('/sync', async (req, res) => {
        const database = new Database();
        const rawPosts = await database.get('posts');
        const posts = rawPosts
            .filter(a => a.data)
            .sort((a, b) => b.date - a.date)
            .slice(0, 20);

        res.status(200).json({
            success: true,
            posts
        });
    })
}
