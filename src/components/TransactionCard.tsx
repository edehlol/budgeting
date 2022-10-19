import { Button, Card, Group, Modal, Text } from "@mantine/core";
import { Transaction } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useState } from "react";
import TransactionForm from "./TransactionForm";

interface Props {
  transaction: Transaction;
}

export default function TransactionCard({ transaction }: Props) {
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
            <Text size="sm" color="dimmed">
              {dayjs(transaction.createdAt).format("DD MMM YYYY")}
            </Text>
          </div>
          <Text
            size="lg"
            color={transaction.type === "expense" ? "red" : "green"}
            weight={500}
          >
            {transaction.type === "expense" ? "-" : "+"} {transaction.amount}
          </Text>
        </Group>
      </Card>
    </>
  );
}
