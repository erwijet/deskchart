import {
    ActionIcon,
    Anchor,
    AspectRatio,
    Box,
    Button,
    Center,
    Divider,
    Group,
    Mark,
    Overlay,
    Paper,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { Github, Linkedin, Twitter } from "lucide-react";

import { Google } from "shared/assets/Google";
import { theme } from "shared/theme";
import { trpc } from "~router";

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
        <Group>
            <Center h="100vh" flex={1}>
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
                <Footer />
            </Center>
            <Box w="100%" h="100vh" pos={"relative"} flex={1} bg="black">
                <Overlay
                    gradient="linear-gradient(145deg, var(--mantine-color-green-7) 0%, var(--mantine-color-green-4) 100%)"
                    opacity={1}
                />
            </Box>
        </Group>
    );
}

const Footer = () => {
    return (
        <Stack pos={"absolute"} bottom={0} p={"md"}>
            <Group justify="center">
                <Text c="dimmed">
                    Made with 🐈 by{" "}
                    <Anchor underline="hover" href="https://www.linkedin.com/in/tiia-shea-165a16227/">
                        Tiia Shea
                    </Anchor>{" "}
                    &amp;{" "}
                    <Anchor underline="hover" href="https://holewinski.dev">
                        @erwijet
                    </Anchor>
                </Text>
                <Divider orientation="vertical" />
                <Group gap={4}>
                    <ActionIcon size={"sm"} variant="subtle" autoContrast component="a" href="https://github.com/erwijet/deskchart">
                        <Github />
                    </ActionIcon>
                </Group>
            </Group>
        </Stack>
    );
};
