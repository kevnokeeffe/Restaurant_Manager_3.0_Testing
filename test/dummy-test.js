const expect = require('chai').expect;

//Redundant tests:
describe("testing test", () => {
    it('should add two numbers correctly', function () {
        const num1 = 2;
        const num2 = 3;
        expect(num1 + num2).to.equal(5);
    });

    it('should add two numbers correctly', function () {
        const num1 = 2;
        const num2 = 3;
        expect(num1 + num2).not.to.equal(6);
    });
});