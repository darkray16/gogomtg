const request = require('superagent');
const assert = require('assert');

var testCard = 'Jace Beleren';
var imageQueryString =  'http://magictcgprices.appspot.com/api/images/imageurl.json?cardname=' + testCard;
var expectedPayload = 'http://magiccards.info/scans/en/ddajvc/1.jpg';

describe('Image API', () => {
    before((done) => {
        console.log('before');
        done();
    });

    after((done) => {
        console.log('after');
        done();
    });

    it('Able to receive card image URL', (done) => {
        request
            .get(imageQueryString)
            .end((err, res) => {
                assert(res.body.length > 0, 'Payload from image API is empty; bad query?');
                assert.equal(res.body, expectedPayload, 'Did not receive the payload we were expecting');
                assert.equal(res.statusCode, 200, 'Did not receive 200 status code from image API');
                done();
            });
    });
});

describe('XRAY API', () => {
    before((done) => {
        console.log('before');
        done();
    });

    after((done) => {
        console.log('after');
        done();
    });

    it('Able to find Chemical X', (done) => {
        done();
    });
});
