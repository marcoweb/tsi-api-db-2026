import { Router, Request, Response } from "express";
import { db } from "../db";
import { Genero } from "../model/genero";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    db.all("SELECT * FROM generos", (erro, linhas) => {
        if(erro) {
            return res.status(500).json(
                {erro: "Erro ao buscar gêneros"}
            );
        }
        res.json(linhas);
    });
});

router.post("/", (req: Request, res: Response) => {
    const {nome} = req.body

    db.run(
        "INSERT INTO generos (nome) VALUES (?)",
        [nome],
        function (erro) {
            if(erro) {
                return res.status(500).json(
                    { erro: "Erro ao cadastrar gênero." }
                );
            }

            res.status(201).json({
                id: this.lastID,
                nome,
            })
        }
    );
});

export default router;