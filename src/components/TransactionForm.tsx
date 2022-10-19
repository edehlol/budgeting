import {
  Button,
  Group,
  NumberInput,
  SegmentedControl,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";

interface FormValues {
  type: string;
  name: string;
  amount: number;
}

interface Props {
  values: FormValues;
  handleSubmit: (values: FormValues) => void;
}

export default function TransactionForm({ handleSubmit, values }: Props) {
  const form = useForm({
    initialValues: {
      type: values.type || "expense",
      name: values.name || "",
      amount: values.amount || 0,
    },
  });
  return (
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
        <NumberInput {...form.getInputProps("amount")} label="Amount" min={0} />
        <Group position="right">
          <Button type="submit">{values ? "Save" : "Add"}</Button>
        </Group>
      </Stack>
    </form>
  );
}
