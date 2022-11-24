const express = require('express');
const cors = require('cors');

const app = express();

// app using
app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');

})

app.listen(5000, ()=>{
    console.log('listening on port 5000');
})