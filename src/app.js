const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const router = require('./routes');

const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(express.json());
app.use(express.static('./src/public'));
app.use(router);

app.listen(port, () =>{
    console.log(`Server started on port ${port}`);
});
