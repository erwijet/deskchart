import { ActionIcon, Button, ButtonProps, Group, Menu, PolymorphicComponentProps } from "@mantine/core";
import { ChevronDown } from "lucide-react";
import { ReactNode } from "react";
import classes from "shared/components/split-button/split-button.module.css";

type SplitButtonProps = PolymorphicComponentProps<"button", ButtonProps> & {
    menu: { [label: string]: { fn: () => unknown; icon?: ReactNode; color?: string } };
};

export const SplitButton = ({ menu, size = "sm", ...buttonProps }: SplitButtonProps) => {
    return (
        <Group wrap="nowrap" gap={0}>
            <Button {...buttonProps} className={classes.button} size={size} variant="filled" />
            <Menu position="bottom-end" withinPortal>
                <Menu.Target>
                    <ActionIcon variant="filled" size={36} className={classes.menuControl}>
                        <ChevronDown size={16} />
                    </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                    {Object.entries(menu).map(([label, { fn, ...opts }]) => (
                        <Menu.Item key={label} onClick={() => fn()} leftSection={opts.icon} color={opts.color}>
                            {label}
                        </Menu.Item>
                    ))}
                </Menu.Dropdown>
            </Menu>
        </Group>
    );
};
