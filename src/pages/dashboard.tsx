import {
  Button,
  Card,
  Group,
  Modal,
  NumberInput,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { Transaction } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import TransactionCard from "../components/TransactionCard";

const TransactionModal = () => {
  const { refetch } = useQuery(["transactions"], async () => {
    const response = await fetch("/api/transaction");
    return response.json();
  });
  const [opened, setOpened] = useState(false);
  const form = useForm({
    initialValues: {
      type: "expense",
      name: "",
      amount: 0,
    },
  });

  const handleSubmit = async () => {
    const body = {
      type: form.values.type,
      name: form.values.name,
      amount: form.values.amount,
    };
    const response = await fetch("/api/transaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
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
        title="New Transaction"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <SegmentedControl
              {...form.getInputProps("type")}
              data={[
                { label: "Expense", value: "expense" },
                { label: "Income", value: "income" },
              ]}
            />
            <TextInput {...form.getInputProps("name")} label="Name" />
            <NumberInput
              {...form.getInputProps("amount")}
              label="Amount"
              min={0}
            />
            <Group position="right">
              <Button type="submit">Add</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
      <Button onClick={() => setOpened(true)}>Add Transaction</Button>
    </>
  );
};

export default function DashboardPage() {
  const { data } = useQuery(["transactions"], async () => {
    const response = await fetch("/api/transaction");
    return response.json();
  });
  console.log(data);
  return (
    <>
      <h1>Dashboard</h1>
      <Stack>
        <Group position="right">
          <TransactionModal />
        </Group>

        {data?.map((transaction: Transaction, index: number) => (
          <TransactionCard transaction={transaction} key={index} />
        ))}
      </Stack>
    </>
  );
}
