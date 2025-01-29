import "react-resizable/css/styles.css";
import "reactflow/dist/style.css";

import { useEffect, useMemo } from "react";
import ReactFlow, { Background, useNodesState } from "reactflow";

import { Box, Button, Group, Menu, MenuDropdown, Paper, rem, Select } from "@mantine/core";
import { useClassroomFormContext } from "../classroom/context";
import { useFormSubscription } from "shared/hooks/use-form-subscription";

const gridSpacing = 10;

export const SeatsEditor = () => {
    const form = useClassroomFormContext();
    const [nodes, setNodes, onNodesChanged] = useNodesState([]);
    const pods = useFormSubscription(form, "pods");

    form.watch("seats", (seats) => {
        if (JSON.stringify(seats.previousValue) == JSON.stringify(seats.value)) return;

        setNodes(
            seats.value.map((seat) => ({
                id: seat.id,
                type: "resizableNode",
                data: { hex: form.values.pods.find((it) => it.id == seat.podId)!.hex, podId: seat.podId },
                position: { x: seat.row, y: seat.col },
            })),
        );
    });

    useEffect(() => {
        const mapped = nodes.map((node) => ({
            id: node.id,
            row: node.position.x,
            col: node.position.y,
            flag: node.data.flag,
            podId: node.data.podId,
        }));

        if (JSON.stringify(mapped) == JSON.stringify(form.getValues().seats)) return;

        form.setFieldValue("seats", mapped);
    }, [JSON.stringify(nodes)]);

    useEffect(() => {
        document.querySelector(".react-flow__panel")?.remove();
    }, []);

    const nodeTypes = useMemo(() => ({ resizableNode: ResizableNode }), []);
    const selected = nodes.find((it) => it.selected);

    return (
        <Paper h="66vh" w="100%" withBorder shadow="md">
            <ReactFlow nodes={nodes} onNodesChange={onNodesChanged} nodeTypes={nodeTypes} snapToGrid snapGrid={[gridSpacing, gridSpacing]}>
                <Background gap={gridSpacing} />

                <Box
                    pos="absolute"
                    bottom={rem(36)}
                    left="50%"
                    style={{
                        transform: "translate(-50%, 0px)",
                        zIndex: 10,
                        display: !selected ? "none" : undefined,
                    }}
                >
                    <Select
                        searchable
                        value={selected?.data["podId"]}
                        data={pods.map((pod) => ({ value: pod.id, label: pod.title }))}
                        onChange={(v) =>
                            setNodes((prev) =>
                                prev.map((it) =>
                                    it.id == selected!.id
                                        ? {
                                              ...it,
                                              data: {
                                                  ...it.data,
                                                  podId: v,
                                                  hex: form.getValues().pods.find((it) => it.id == v)!.hex,
                                              },
                                          }
                                        : it,
                                ),
                            )
                        }
                    />
                </Box>
            </ReactFlow>
        </Paper>
    );
};

const ResizableNode = ({ selected, data }: { selected: boolean; data: { hex: string } }) => {
    return (
        <>
            <div
                style={{
                    padding: "20px",
                    backgroundColor: data.hex,
                    height: "100%",
                    border: "solid 1px",
                    borderRadius: "1px",
                    borderColor: selected ? "var(--mantine-primary-color-filled)" : "var(--mantine-color-gray-outline)",
                }}
            />
        </>
    );
};
