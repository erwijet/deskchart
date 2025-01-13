import { ActionIcon, Container, ContainerProps, Group, Stack, Title } from "@mantine/core";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import React, { ReactNode } from "react";
import { createMarkerComponent } from "shared/fns";

export type ContentProps = {
    withBack?: boolean;
    title?: string;
} & ContainerProps;

const Action = createMarkerComponent();
export const Content = Object.assign(
    ({ withBack, title, children, ...rest }: ContentProps) => {
        const { actions, other: body } = createSlots(children, {
            actions: Action,
        });

        const hasHeader = !!withBack || !!actions || !!title;

        return (
            <Container size={"lg"} py="xs" {...rest}>
                <Stack>
                    {hasHeader && (
                        <Group justify="space-between" py="lg">
                            <Group gap="xs">
                                {withBack && <BackButton />}
                                {title && <Title order={2}>{title}</Title>}
                            </Group>
                            {actions ? <Group wrap="nowrap">{actions}</Group> : <div />}
                        </Group>
                    )}
                </Stack>
                {body}
            </Container>
        );
    },
    { Action },
);

const BackButton = () => {
    const { history } = useRouter();
    return (
        <ActionIcon variant="subtle" onClick={() => history.back()}>
            <ArrowLeft />
        </ActionIcon>
    );
};

type SlotResult<S extends string> = {
    [K in S | "other"]: ReactNode[];
};

type AnyFC = React.FC<any>; // eslint-disable-line

function createSlots<S extends string>(children: ReactNode, config: { [s in S]: AnyFC }): SlotResult<S> {
    const ss = Object.keys(config).concat(["other"]) as S[];

    const nodes = React.Children.toArray(children);
    function eq(node: ReactNode, f: AnyFC) {
        if (!React.isValidElement(node)) return false;
        return node.type === f;
    }

    return Object.fromEntries(
        ss.map((s) => {
            if (s == "other") return ["other", nodes.filter((node) => !ss.some((s) => eq(node, config[s])))];
            return [s, nodes.filter((node) => eq(node, config[s]))];
        }),
    ) as SlotResult<S>;
}
