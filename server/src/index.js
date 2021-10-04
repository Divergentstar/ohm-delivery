const shortid = require('shortid');
const bodyParser = require('body-parser')
const Utils = require('./utils');

var express = require('express');
var app = express();
app.use(bodyParser.json());

async function serve() {
    app.get('/ohms/:id', async (req, res) => {
        const ohm = await Utils.getOhmById(req.params.id);

        if (!ohm) {
			res.status(404);
		}

        res.send(ohm);
    });

    app.put('/ohms/:id/status', async (req, res) => {
        const ohm = await Utils.updateOhmStatus(req.params.id, req.body.status);

        if (!ohm) {
			res.status(404);
		}

        res.send(ohm);
    });

    app.listen(3000, () => console.log('listening on port 3000'));
}

serve();