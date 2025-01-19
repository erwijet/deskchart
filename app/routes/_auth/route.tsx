import { AppShell, Box, Burger, Group, Loader, rem, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Sidebar } from "shared/components/sidebar";
import { Suspense } from "react";
import { Brand } from "shared/assets/Brand";
import { useIsMobile } from "shared/hooks/use-is-mobile";
import { qc, queries } from "shared/query";
import { session, SessionRenewer } from "shared/session";

export const Route = createFileRoute("/_auth")({
    beforeLoad: async () => {
        const token = session.getToken();
        if (!token) throw redirect({ to: "/login" });

        await qc.ensureQueryData(queries.session());
    },
    component: Component,
});

function Component() {
    const [opened, { toggle }] = useDisclosure(false);
    const { isMobile } = useIsMobile();

    return (
        <AppShell
            header={{ height: 60, collapsed: !isMobile }}
            navbar={{
                width: rem(80),
                breakpoint: "sm",
                collapsed: { mobile: !opened },
            }}
        >
            <AppShell.Header>
                <Group h="100%" px="md" justify="space-between" bg="var(--mantine-primary-color-filled)">
                    <Group>
                        <Burger
                            opened={opened}
                            onClick={toggle}
                            hiddenFrom="sm"
                            size="sm"
                            color={"var(--mantine-primary-color-contrast)"}
                        />
                        <Title order={3} c="var(--mantine-primary-color-contrast)">
                            DeskChart
                        </Title>
                    </Group>
                    <Box h="30px" w="30px">
                        <Brand />
                    </Box>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar style={{ width: rem(80) }}>
                <Sidebar />
            </AppShell.Navbar>
            <AppShell.Main>
                <Suspense
                    fallback={
                        <Loader
                            m="auto"
                            style={{
                                transform: "translate(0px, calc((100vh / 2) - (100% / 2)))",
                            }}
                        />
                    }
                >
                    <SessionRenewer />
                    <Outlet />
                </Suspense>
            </AppShell.Main>
        </AppShell>
    );
}
