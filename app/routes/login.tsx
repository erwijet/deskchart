import { ActionIcon, Anchor, Box, Button, Center, Divider, Flex, Group, Overlay, Paper, rem, Stack, Text, Title } from "@mantine/core";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Github } from "lucide-react";
import { Brand } from "shared/assets/Brand";
import { Google } from "shared/assets/Google";
import { useIsMobile } from "shared/hooks/useIsMobile";

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

    const { isMobile } = useIsMobile();

    return (
        <Group>
            {isMobile && (
                <Flex pos={"absolute"} top={0} left={0} h={rem(60)} w="100vw" bg={"var(--mantine-primary-color-filled)"} p='xs' justify={'center'}>
                    <Brand />
                </Flex>
            )}
            <Center h="100vh" flex={1} pos="relative">
                <Paper radius="md" p="xl" withBorder shadow="lg" style={{ zIndex: 10e3 }}>
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
            {!isMobile && (
                <Box w="100%" h="100vh" pos={"relative"} flex={1} bg="black">
                    <Overlay
                        gradient="linear-gradient(145deg, var(--mantine-color-green-7) 0%, var(--mantine-color-green-4) 100%)"
                        opacity={1}
                    />
                </Box>
            )}
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
