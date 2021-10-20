const express = require('express');
const app = express();
const PORT = process.env.PORT || 3030;

app.use(express.json());

app.post('/test', (req, res) => res.json(req.body));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));