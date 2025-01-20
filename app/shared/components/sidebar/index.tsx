import { Stack, Tooltip, UnstyledButton } from "@mantine/core";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import classes from "components/sidebar/sidebar.module.css";
import { LogOut, School, Settings } from "lucide-react";
import { Brand } from "../../assets/Brand";
import { useIsMobile } from "shared/hooks/use-is-mobile";

interface SidebarLinkProps {
    icon: typeof School;
    label: string;
    active?: boolean;
    onClick?: () => void;
}

function SidebarLink({ icon: Icon, label, active, onClick }: SidebarLinkProps) {
    return (
        <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
            <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
                <Icon size={20} strokeWidth={1.5} />
            </UnstyledButton>
        </Tooltip>
    );
}

const routes = [
    { icon: School, label: "Classrooms", path: "/classrooms" },
    { icon: Settings, label: "Settings", path: "/settings" },
];

export const Sidebar = () => {
    const { location } = useRouterState();
    const { isMobile } = useIsMobile();
    const navigate = useNavigate();

    const links = routes.map((link) => (
        <SidebarLink
            {...link}
            key={link.label}
            active={location.pathname.startsWith(link.path)}
            onClick={() => void navigate({ to: link.path })}
        />
    ));

    return (
        <nav className={classes.sidebar}>
            {!isMobile && (
                <Link to="/">
                    <Brand />
                </Link>
            )}
            <div className={classes.sidebarMain}>
                <Stack justify="center" gap={0}>
                    {links}
                </Stack>
            </div>

            <Stack justify="center" gap={0}>
                <Link to="/logout">
                    <SidebarLink icon={LogOut} label="Logout" />
                </Link>
            </Stack>
        </nav>
    );
};
