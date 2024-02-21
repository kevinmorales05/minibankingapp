const dotenv = require("dotenv");
dotenv.config();
const swaggerAutoGen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Mini Banking API',
        description: 'Mini Banking Api'
    },
    host:  process.env.HOST,
    schemes: ['http', 'https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutoGen(outputFile, endpointsFiles, doc);