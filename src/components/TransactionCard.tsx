import { Button, Card, Group, Modal, Text } from "@mantine/core";
import { Transaction, TransactionType } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import TransactionForm from "./TransactionForm";

interface Props {
  transaction: Transaction;
}

export default function TransactionCard({ transaction }: Props) {
  const { EXPENSE } = TransactionType;
  const [opened, setOpened] = useState(false);

  const { refetch } = useQuery(["transactions"], async () => {
    const response = await fetch("/api/transaction");
    return response.json();
  });

  const handleDelete = async () => {
    const response = await fetch(`/api/transaction/${transaction.id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setOpened(false);
      refetch();
    }
  };
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={transaction.name}
      >
        <TransactionForm
          values={{
            type: transaction.type,
            name: transaction.name,
            amount: transaction.amount,
          }}
          handleSubmit={async (values) => {
            const body = {
              type: values.type,
              name: values.name,
              amount: values.amount,
            };
            const response = await fetch(`/api/transaction/${transaction.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            });
            if (response.ok) {
              setOpened(false);
              refetch();
            }
          }}
        />
        <Button color="red" onClick={handleDelete}>
          Delete
        </Button>
      </Modal>
      <Card withBorder onClick={() => setOpened(true)}>
        <Group position="apart">
          <div>
            <Text>{transaction.name}</Text>
          </div>
          <Text
            size="lg"
            color={transaction.type === EXPENSE ? "red" : "green"}
            weight={500}
          >
            {transaction.type === EXPENSE ? "-" : "+"} {transaction.amount}
          </Text>
        </Group>
      </Card>
    </>
  );
}
