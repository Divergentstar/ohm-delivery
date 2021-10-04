const shortid = require('shortid');
const bodyParser = require('body-parser')
const Utils = require('./utils');

var express = require('express');
var app = express();
app.use(bodyParser.json());

async function serve() {
    app.get('/ohms/:trackingId', async (req, res) => {
        const ohm = await Utils.getOhmByTrackingId(req.params.trackingId);

        if (!ohm) {
			res.status(404);
		}

        res.send(ohm);
    });

    app.put('/ohms/:trackingId/status', async (req, res) => {
        const ohm = await Utils.updateOhmStatus(req.params.trackingId, req.body.status, req.body.comment);

        if (!ohm) {
			res.status(404);
		}

        res.send(ohm);
    });

    app.listen(3000, () => console.log('listening on port 3000'));
}

serve();