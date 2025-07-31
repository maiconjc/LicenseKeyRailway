import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_, res) => {
  res.json({ message: "API online" });
});

app.post('/api/generate', (req, res) => {
  const { installationId } = req.body;

  if (!installationId) {
    return res.status(400).json({ error: "installationId é obrigatório" });
  }

  const cid = "CID-" + installationId.slice(0, 5) + "-GERADO";
  res.json({ cid });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
