import chai from 'chai';
import chaihttp from 'chai-http';
chai.use(chaihttp);

const {expect, request} = chai;

const host = `127.0.0.1:5000`

describe('API TESTS', () => { 
    // to pass to pass
    it('Should fetch all products', async ()=>{
        const res = await request(host).get('/api/inventory/items')
        .set("content-type", 'application/json');

        expect(res).to.have.status(200)
    }).timeout(20000);

    // Pass to pass
    it('Response should contain actual product data', async ()=>{
        const res = await request(host).get('/api/inventory/items')
        .set("content-type", 'application/json');

        expect(res.text).to.exist
    }).timeout(20000);

    // Fail to passgi
    it('it should not fetch product data if the end point is wrongly spelt', async ()=>{
        const res = await request(host).get('/api/inventory/item')
        .set("content-type", 'application/json');

        expect(res).to.have.status(404)
    }).timeout(20000);

})