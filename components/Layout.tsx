import {
  AppShell,
  Avatar,
  Button,
  Container,
  createStyles,
  Group,
  Header,
  Text,
} from "@mantine/core";
import { signIn, useSession, signOut } from "next-auth/react";

const useStyles = createStyles((theme) => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },
}));

export default function Layout({ children }: { children: React.ReactNode }) {
  const { classes } = useStyles();
  const { data: session } = useSession();
  return (
    <AppShell
      header={
        <Header height={60}>
          <Container className={classes.header}>
            <Group position="apart" sx={{ width: "100%" }}>
              <Text>Budgeting</Text>
              {session ? (
                <Group>
                  <Avatar src={session.user?.image} radius="xl" />
                  <Text>Signed in as {session.user?.name}</Text>
                  <Button
                    onClick={() => signOut()}
                    variant="outline"
                    color="red"
                  >
                    Sign out
                  </Button>
                </Group>
              ) : (
                <Button onClick={() => signIn()}>Sign in</Button>
              )}
            </Group>
          </Container>
        </Header>
      }
    >
      <Container>{children}</Container>
    </AppShell>
  );
}
