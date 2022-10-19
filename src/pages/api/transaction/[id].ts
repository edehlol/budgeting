import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../../prisma/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const transactionId = req.query.id;

  const session = await getSession({ req });

  if (req.method === "DELETE") {
    if (session) {
      const transaction = await prisma.transaction.delete({
        where: { id: transactionId as string },
      });
      res.json(transaction);
    }
  } else if (req.method === "PUT") {
    if (session) {
      const transaction = await prisma.transaction.update({
        where: { id: transactionId as string },
        data: {
          ...req.body,
        },
      });
      res.json(transaction);
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
