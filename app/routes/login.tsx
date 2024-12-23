import { Button, Center, Divider, Group, Paper, Text, Title } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

import { trpc } from "~router";
import { Google } from "components/assets/Google";

export const Route = createFileRoute("/login")({
    component: RouteComponent,
});

function RouteComponent() {
    const [{ url }] = trpc.notary.getAuthUrl.useSuspenseQuery("google", {
        refetchInterval: 5 * 1000, // 5 seconds
    });

    function handleOAuthGoogle() {
        window.location.href = url;
    }

    return (
        <Center h="100vh">
            <Paper radius="md" p="xl" withBorder shadow="lg">
                <Group wrap="nowrap" gap={4}>
                    <Title order={3} textWrap="nowrap">
                        Welcome to
                    </Title>
                    <Text fz={"h3"} fw="bold" variant="gradient" gradient={{ from: "green", to: "cyan" }}>
                        DeskChart
                    </Text>
                </Group>

                <Divider label="continue with" labelPosition="center" my="sm" />

                <Group>
                    <Button variant="default" w="100%" leftSection={<Google />} onClick={handleOAuthGoogle}>
                        Google
                    </Button>
                </Group>
            </Paper>
        </Center>
    );
}
