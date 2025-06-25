const express = require('express');
const analyzeRouter = require('./analyze');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use('/api/analyze', analyzeRouter);

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
