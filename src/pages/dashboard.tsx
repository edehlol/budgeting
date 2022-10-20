import {
  Button,
  Card,
  Divider,
  Group,
  Modal,
  NumberInput,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Transaction, TransactionType } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useState } from "react";
import TransactionCard from "../components/TransactionCard";
import TransactionForm, { FormValues } from "../components/TransactionForm";
import { authOptions } from "./api/auth/[...nextauth]";

const TransactionModal = () => {
  const { refetch } = useQuery(["transactions"], async () => {
    const response = await fetch("/api/transaction");
    return response.json();
  });
  const [opened, setOpened] = useState(false);

  const handleSubmit = async (values: FormValues) => {
    const body = {
      type: values.type,
      name: values.name,
      amount: values.amount,
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
        <TransactionForm handleSubmit={handleSubmit} />
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

        {data?.length > 0 &&
          data?.map((transaction: Transaction, index: number) => (
            <>
              {index === 0 ||
              dayjs(transaction.createdAt).isBefore(
                dayjs(data[index - 1].createdAt),
                "day"
              ) ? (
                <div>
                  <Group position="apart">
                    <Text color="dimmed" size="sm">
                      {dayjs(transaction.createdAt).format("MMM DD")}
                    </Text>

                    <Text color="dimmed" size="sm">
                      {data
                        .filter(
                          (t: Transaction) =>
                            dayjs(t.createdAt).format("YYYY-MM-DD") ===
                            dayjs(transaction.createdAt).format("YYYY-MM-DD")
                        )
                        .reduce(
                          (acc: number, t: Transaction) =>
                            t.type === TransactionType.INCOME
                              ? acc + t.amount
                              : acc - t.amount,
                          0
                        )}
                    </Text>
                  </Group>
                  <Divider mt="sm" />
                </div>
              ) : null}
              <TransactionCard key={index} transaction={transaction} />
            </>
          ))}
      </Stack>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await unstable_getServerSession(
    ctx.req,
    ctx.res,
    authOptions
  );
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
