const utils = require('../src/utils');

describe('db return ohm', () => {
	test('returns existing Ohm object', async () => {
		expect(await utils.getOhmByTrackingId('1e62adfe')).toBeDefined();
	});

	test('returns undefined', async () => {
		expect(await utils.getOhmByTrackingId('invalid')).toBeUndefined();
	});

	test('has a valid history', async () => {
		const ohm = await utils.getOhmByTrackingId('1e62adfe');
		const statusses = await utils.getStatusses();
        const statusCodes = statusses.reduce((arr, possibleNextStatusses) => arr.concat(possibleNextStatusses.map((status) => status.code)), []);
		const isValidStatus = statusCodes.includes(ohm.history[0].state)
		expect(isValidStatus).toBe(true);
	});
});

describe('db update ohm', () => {
	test('returns non-updated Ohm object', async () => {
		expect((await utils.updateOhmStatus('1e62adfe', 'READY')).status).toEqual('IN_DELIVERY');
	});

	test('returns updated Ohm object', async () => {
		expect((await utils.updateOhmStatus('1e62adfe', 'DELIVERED')).status).toEqual('DELIVERED');
	});
});

describe('db return status', () => {
    test('returns all available status codes', async () => {
        const statusses = await utils.getStatusses();
        const statusCodes = statusses.reduce((arr, possibleNextStatusses) => arr.concat(possibleNextStatusses.map((status) => status.code)), []);
		expect(statusCodes).toEqual(expect.arrayContaining([
			'CREATED',
			'PREPARING',
			'READY',
			'IN_DELIVERY',
			'DELIVERED',
			'REFUSED'
		]));
	});

	test('returns 1 next state as array', async () => {
		expect((await utils.getPossibleNextStatusses('CREATED')).length).toEqual(1);
	});

	test('returns 2 next states as array', async () => {
		expect((await utils.getPossibleNextStatusses('IN_DELIVERY')).length).toEqual(2);
	});

	test('returns empty array', async () => {
		expect((await utils.getPossibleNextStatusses('INVALID')).length).toEqual(0);
	});
});
