import {
  Button,
  Group,
  NumberInput,
  SegmentedControl,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";

export interface FormValues {
  type: "EXPENSE" | "INCOME";
  name: string;
  amount: number;
}

interface Props {
  values?: FormValues;
  handleSubmit: (values: FormValues) => void;
}

export default function TransactionForm({ handleSubmit, values }: Props) {
  const form = useForm({
    initialValues: {
      type: values?.type || "EXPENSE",
      name: values?.name || "",
      amount: values?.amount || 0,
    },
  });
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <SegmentedControl
          {...form.getInputProps("type")}
          data={[
            { label: "Expense", value: "EXPENSE" },
            { label: "Income", value: "INCOME" },
          ]}
        />
        <TextInput {...form.getInputProps("name")} label="Name" />
        <NumberInput {...form.getInputProps("amount")} label="Amount" min={0} />
        <Group position="right">
          <Button type="submit">{values ? "Save" : "Add"}</Button>
        </Group>
      </Stack>
    </form>
  );
}
