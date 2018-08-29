const express = require('express');
const app = express();
app.set('port', process.env.PORT || 8080);
app.get('/', (request, response) => response.send('<b>Hello, World!</b>'));
app.listen(app.get('port'), () => console.log(`Server is running on port "${app.get('port')}".`));
