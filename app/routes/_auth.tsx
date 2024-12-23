import { AppShell, Burger, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Navbar } from "app/shared/components/Navbar";
import { useIsMobile } from "app/shared/hooks/useIsMobile";
import { qc, queries } from "shared/query";

export const Route = createFileRoute("/_auth")({
    beforeLoad: () => {
        const token = localStorage.getItem("app.deskchart.notary.token");
        if (!token) throw redirect({ to: "/login" });
    },
    loader: async () => {
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
            navbar={{ width: "fit-content", breakpoint: "sm", collapsed: { mobile: !opened } }}
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    {/* <MantineLogo size={30} /> */}
                </Group>
            </AppShell.Header>
            <AppShell.Navbar>
                <Navbar />
            </AppShell.Navbar>
            <AppShell.Main>Main</AppShell.Main>
        </AppShell>
    );
}
