import express from "express";
import "./db"
import generosRouter from "./routes/generos";

const app = express();
const PORT = 3003;

app.use(express.json());

app.use("/generos", generosRouter);

app.listen(PORT, () => {
    console.log(`Servidor executando em localhost:${PORT}`)
});