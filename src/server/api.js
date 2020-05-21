import express from 'express';
import Parser from 'rss-parser';

const parser = new Parser();

const rssList = new Set();

export default (server) => {
    const router = express.Router();

    router.post('/add', (req, res) => {
        const {url} = req.body;
        if (rssList.has(url)){
            res.send({added: false, rssList: [...rssList]});
            return;
        }

        rssList.add(url);
        res.send({added: true, rssList: [...rssList]});
      });

    router.post('/del', (req, res) => {
        const {url} = req.body;
        if (!rssList.has(url)){
            res.send({removed: false, rssList: [...rssList]});
            return;
        }

        rssList.delete(url);
        res.send({removed: true, rssList: [...rssList]});
      });


    router.get('/list', (req, res, next) => {
        res.send([...rssList]);
    });

    router.get('/refresh', async (req, res) => {
        try {
            const result = [];
            for (const url of rssList)
            {
                const feed = await parser.parseURL(url);
                result.push(feed);
            }
            res.send(result);
        } catch(e) {
            next(e);
        }
    });
    
    return router;
}