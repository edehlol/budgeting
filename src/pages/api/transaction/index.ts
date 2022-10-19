import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../../prisma/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, type, amount } = req.body;
  const session = await getSession({ req });

  if (session) {
    if (req.method === "POST") {
      const createTransaction = await prisma.transaction.create({
        data: {
          name,
          type,
          amount,
          user: { connect: { email: session.user?.email as string } },
        },
      });
      res.json(createTransaction);
    }
    if (req.method === "GET") {
      const getTransactions = await prisma.transaction.findMany({
        where: { user: { email: session.user?.email as string } },
      });
      res.json(getTransactions);
    }
  } else {
    res.status(401).send({ message: "Unauthorized" });
  }
}
