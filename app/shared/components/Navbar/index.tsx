import { Stack, Tooltip, UnstyledButton } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import classes from "components/Navbar/Navbar.module.css";
import { Grid3X3, LogOut, School, Settings } from "lucide-react";
import { useState } from "react";

import { Brand } from "../assets/Brand";

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

const mockdata = [
    { icon: School, label: "Classrooms" },
    { icon: Grid3X3, label: "Desk Plans" },
    { icon: Settings, label: "Settings" },
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
                    <NavbarLink icon={LogOut} label="Logout" />
                </Link>
            </Stack>
        </nav>
    );
};
