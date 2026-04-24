import { Router, Request, Response } from "express";
import { db } from "../db";
import { prisma } from "../prisma";

const router = Router();

// router.get("/", (req: Request, res: Response) => {
//     db.all("SELECT * FROM generos", (erro, linhas) => {
//         if(erro) {
//             return res.status(500).json(
//                 {erro: "Erro ao buscar gêneros"}
//             );
//         }
//         res.json(linhas);
//     });
// });

router.get("/", async (req: Request, res: Response) => {
  try {
    const generos = await prisma.genero.findMany();

    res.json(generos);
  } catch (error) {
    res.status(500).json({
      erro: "Erro ao buscar gêneros"
    });
  }
});

router.post("/", (req: Request, res: Response) => {
    const {nome} = req.body;

    if(!nome || nome.trim() === "") {
        return res.status(400).json(
            { erro : "O campo nome do gênero é obrigatório."}
        );
    }

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

router.put("/:id", (req : Request, res: Response) => {
    const id = Number(req.params.id);
    const {nome} = req.body;

    db.run(
        "UPDATE generos SET nome = ? WHERE id = ?",
        [nome, id],
        function(erro) {
            if(erro) {
                return res.status(500).json(
                    { erro: "Erro ao atualizar gênero." }
                );
            }

            if(this.changes === 0) {
                return res.status(404).json(
                    { erro: "Gênero não encontrado"}
                );
            }

            res.json({
                id,
                nome
            })
    });
});

router.delete("/:id", (req : Request, res: Response) => {
    const id = Number(req.params.id);

    db.run(
        "DELETE FROM generos WHERE id = ?",
        [id],
        function(erro) {
            if(erro) {
                return res.status(500).json(
                    { erro: "Erro ao remover gênero." }
                );
            }

            if(this.changes === 0) {
                return res.status(404).json(
                    { erro: "Gênero não encontrado"}
                );
            }

            res.status(204).send();
        }
    );
});


router.get("/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);

    db.get(
        "SELECT * FROM generos WHERE id = ?",
        [id],
        (erro, linha) => {
            if(erro) {
                return res.status(500).json(
                    {erro : "Erro ao buscar gênero"}
                );
            }

            if(!linha) {
                return res.status(404).json(
                    {erro : "Gênero não encontrado"}
                );
            }

            res.json(linha)
        }
    );
});

export default router;