const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('./models/home');
const Home = mongoose.model("Home");

require('./models/contato');
const Contato = mongoose.model("Contato");

const app = express();

app.use(express.json());

//Cors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", 'GET, PUT, POST, DELETE');
  res.header("Access-Control-Allow-Headers", 'X-PINGOTHER, Content-Type, Authorization');
  app.use(cors());
  next();
});

//Conexão DB
mongoose.connect('mongodb://localhost/db_api', {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
  console.log("Conexão com o DB MongoDB realizado com sucesso!");
}).catch((error) => {
	console.log("Erro: Conexão com o DB MongoDB não realizado com sucesso: ", error)
});

app.get('/', (req, res) => {
  res.json({ name: "Mateus teste" });
});

//Rotas - home
app.get('/home', async (req, res) => {
  await Home.findOne({}).then((home) => {
    return res.json({
      error: false,
      home
    });
  }).catch((error) => {
    return res.status(400).json({
      error: true,
      message: "Nenhum registro encontrado!"
    });
  });
});

app.post('/home', async (req, res) => {
  const homeExiste = await Home.findOne({});
  if(homeExiste) {
    return res.status(400).json({
      error: false,
      message: "Erro: Conteúdo da página já possui um registro!"
    });
  };

	const result = new Home(req.body) 
  await result.save().then(()=>{
    res.json({
      error: false,
      message: "Conteúdo da página home cadastrado com sucesso!"
    });
  }).catch((error)=> {
    res.json({
      error: true,
      message: "Conteúdo da página home não cadastrado com sucesso:", error
    });
  });
});

//Rotas - Contato
app.post('/contato', async (req, res) => {
	const result = new Contato(req.body) 
  await result.save().then(() => {
    res.json({
      error: false,
      message: "Mensagem de contato cadastrada com sucesso!"
    });
  }).catch((error)=> {
    res.status(400).json({
      error: true,
      message: "Mensagem de contato não cadastrada com sucesso:", error
    });
  });
});

//Server
app.listen(8080, () => {
  console.log("Servidor iniciado na porta 8080: http://localhost:8080")
});