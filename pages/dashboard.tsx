import { Button, Card, Group, Stack, Text } from "@mantine/core";

export default function DashboardPage() {
  return (
    <>
      <h1>Dashboard</h1>
      <Stack>
        <Group position="right">
          <Button>Add Transaction</Button>
        </Group>

        <Card withBorder>
          <Group position="apart">
            <div>
              <Text>Groceries</Text>
              <Text size="sm" color="dimmed">
                15 October 2022
              </Text>
            </div>
            <Text size="lg" color="red" weight={500}>
              - $36
            </Text>
          </Group>
        </Card>
      </Stack>
    </>
  );
}
