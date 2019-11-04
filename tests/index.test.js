const axios = require('axios')
const services = require('./../src/services.js')
var exec = require('child_process').exec;
const {defaults} = require('./jest.config.json');

beforeEach(() => {
     dir = exec("npm run dev")
});

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
