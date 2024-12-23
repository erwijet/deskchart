import { Center, Image, Stack, Tooltip, UnstyledButton } from "@mantine/core";
import { IconChalkboard, IconHome2, IconLayout, IconLayoutGrid, IconLogout, IconSchool, IconSettings } from "@tabler/icons-react";
import classes from "components/Navbar/Navbar.module.css";
import { useState } from "react";
import { Brand } from "../assets/Brand";
import { Link } from "@tanstack/react-router";

interface NavbarLinkProps {
    icon: typeof IconHome2;
    label: string;
    active?: boolean;
    onClick?: () => void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
    return (
        <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
            <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
                <Icon size={20} stroke={1.5} />
            </UnstyledButton>
        </Tooltip>
    );
}

const mockdata = [
    { icon: IconChalkboard, label: "Classrooms" },
    { icon: IconLayout, label: "Desk Plans" },
    { icon: IconSettings, label: "Settings" },
];

export const Navbar = () => {
    const [active, setActive] = useState(2);

    const links = mockdata.map((link, index) => (
        <NavbarLink {...link} key={link.label} active={index === active} onClick={() => setActive(index)} />
    ));

    return (
        <nav className={classes.navbar}>
            <Link to="/">
                <Brand />
            </Link>

            <div className={classes.navbarMain}>
                <Stack justify="center" gap={0}>
                    {links}
                </Stack>
            </div>

            <Stack justify="center" gap={0}>
                <Link to="/logout">
                    <NavbarLink icon={IconLogout} label="Logout" />
                </Link>
            </Stack>
        </nav>
    );
};
