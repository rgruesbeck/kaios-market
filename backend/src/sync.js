import Database from '@withkoji/database';
import uuid from 'uuid';

export default function (app) {
    app.post('/sync', async (req, res) => {
        const recordId = uuid.v4();
        const recordBody = {
            date: req.body.date || new Date().toISOString(),
            data: req.body.data || {}
        };

        const database = new Database();
        await database.set('posts', recordId, recordBody);

        res.status(200).json({
            success: true,
            _id: recordId
        });
    })


    // dev: delete records
    /*
    app.get('/syncx', async (req, res) => {
        const database = new Database();
        const rawPosts = await database.get('posts');
        rawPosts.forEach(p => {
            database.delete('posts', p._id)
        })
    })
    */

    app.get('/sync', async (req, res) => {
        const database = new Database();
        const rawPosts = await database.get('posts');

        const posts = rawPosts
            .filter(p => Object.keys(p.data).length > 0)
            .filter(p => {
                return req.query.exclude ?
                req.query.exclude.includes(p._id) :
                true;
            })
            .sort((a, b) => b.date - a.date)
            .slice(0, req.query.length ? parseInt(req.query.length) : 20);

        res.status(200).json({
            success: true,
            posts
        });
    })
}
