const express = require('express');
const app = express();

const { config } = require('./config/index');


app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get('/:year', (req, res) => {
    const year = Number(req.params.year);

    if (year % 4 === 0) return res.send(`${year} es año bisiesto`);
    res.send(`${year} es un año normal`)
})

app.listen(config.port, () => {
    console.log(`listening address http://localhost:${config.port}`);
});
