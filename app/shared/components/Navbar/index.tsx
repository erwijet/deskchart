import { Stack, Tooltip, UnstyledButton } from "@mantine/core";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import classes from "components/navbar/navbar.module.css";
import { Grid3X3, LogOut, School, Settings } from "lucide-react";
import { Brand } from "../../assets/Brand";
import { useIsMobile } from "shared/hooks/use-is-mobile";

interface NavbarLinkProps {
    icon: typeof School;
    label: string;
    active?: boolean;
    onClick?: () => void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
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
    { icon: Grid3X3, label: "Desk Plans", path: "/deskplans" },
    { icon: Settings, label: "Settings", path: "/settings" },
];

export const Navbar = () => {
    const { location } = useRouterState();
    const { isMobile } = useIsMobile();
    const navigate = useNavigate();

    const links = routes.map((link) => (
        <NavbarLink
            {...link}
            key={link.label}
            active={location.pathname.startsWith(link.path)}
            onClick={() => void navigate({ to: link.path })}
        />
    ));

    return (
        <nav className={classes.navbar}>
            {!isMobile && (
                <Link to="/">
                    <Brand />
                </Link>
            )}
            <div className={classes.navbarMain}>
                <Stack justify="center" gap={0}>
                    {links}
                </Stack>
            </div>

            <Stack justify="center" gap={0}>
                <Link to="/logout">
                    <NavbarLink icon={LogOut} label="Logout" />
                </Link>
            </Stack>
        </nav>
    );
};
