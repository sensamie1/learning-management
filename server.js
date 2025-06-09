const app = require('./api');
const db = require('./db');

const port = process.env.PORT || 4001;

db.connect();

app.listen(port, () => console.log(`listening on port: ${port}`));