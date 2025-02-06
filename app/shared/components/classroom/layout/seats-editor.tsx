import "react-resizable/css/styles.css";
import "reactflow/dist/style.css";

import { useEffect, useMemo, useState } from "react";
import ReactFlow, { Background, SelectionMode, useNodesState } from "reactflow";

import { ActionIcon, Box, Group, Paper, rem, Select, Tooltip } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { Copy, Lock, Redo2, Trash, Undo2, Unlock } from "lucide-react";
import { useFormSubscription } from "shared/hooks/use-form-subscription";
import { useUndo } from "shared/hooks/use-undo";
import { createCuid } from "shared/str";
import { useClassroomFormContext } from "shared/components/classroom/context";
import { arr } from "shared/fns";

const gridSpacing = 10;

export const SeatsEditor = () => {
    const form = useClassroomFormContext();
    const pods = useFormSubscription(form, "pods");
    const [nodes, setNodes, onNodesChanged] = useNodesState([]);
    const [isLocked, setIsLocked] = useState(true);
    const [isReady, setIsReady] = useState(false);

    const { canUndo, canRedo, undo, redo, keep } = useUndo(nodes, { setState: setNodes });

    // note: mod <=> cmd
    useHotkeys([
        ["ctrl+z", () => undo(), { preventDefault: true }],
        ["mod+z", () => undo(), { preventDefault: true }],
        ["ctrl+shift+Z", () => redo(), { preventDefault: true }],
        ["mod+shift+Z", () => redo(), { preventDefault: true }],
    ]);

    form.watch("nodes", (update) => {
        if (!isReady) return;
        if (JSON.stringify(update.previousValue) == JSON.stringify(update.value)) return;

        const next = update.value.map((seat) => ({
            id: seat.id,
            type: !!seat.podId ? "SEAT" : "ENTITY",
            data: { podId: seat.podId, entityType: seat.entityType },
            position: { x: seat.row, y: seat.col },
        }));

        if (next.length != nodes.length) keep(next);
        setNodes(next);
    });

    useEffect(() => {
        if (!isReady) return;
        const mapped = nodes.map((node) => ({
            id: node.id,
            row: node.position.x,
            col: node.position.y,
            flag: node.data.flag,
            podId: node.data.podId,
            nodeType: node.type as "SEAT" | "ENTITY",
            entityType: node.data.entityType,
        }));
        if (JSON.stringify(mapped) == JSON.stringify(form.getValues().nodes)) return;
        form.setFieldValue("nodes", mapped, { forceUpdate: true });
    }, [JSON.stringify(nodes)]);

    useEffect(() => {
        document.querySelector(".react-flow__panel")?.remove();
        const initial = form.getValues().nodes.map((node) => ({
            id: node.id,
            type: !!node.podId ? "SEAT" : "ENTITY",
            data: { podId: node.podId, entityType: node.entityType },
            position: { x: node.row, y: node.col },
        }));

        setNodes(initial);
        setIsReady(true);
    }, []);

    const nodeTypes = useMemo(() => ({ SEAT: SeatNode, ENTITY: EntityNode }), []);
    const selected = nodes.filter((it) => it.selected);

    function handleSetPodForSelectedNode(podId: string) {
        keep(nodes);

        setNodes((prev) =>
            prev.map((it) =>
                selected.some((s) => s.id == it.id)
                    ? {
                          ...it,
                          data: {
                              ...it.data,
                              podId,
                              hex: form.getValues().pods.find((it) => it.id == podId)!.hex,
                          },
                      }
                    : it,
            ),
        );
    }

    function handleDuplicateSelectedNode() {
        if (!selected) return;

        keep(nodes);
        setNodes((nodes) => nodes.concat(selected.map((each) => ({ ...each, selected: false, id: createCuid() }))));
    }

    function handleDeleteSelected() {
        if (!selected) return;

        keep(nodes);
        setNodes((nodes) => nodes.filter((it) => !it.selected));
    }

    return (
        <Paper h="66vh" w="100%" withBorder shadow="md">
            <ReactFlow
                snapToGrid
                snapGrid={[gridSpacing, gridSpacing]}
                nodes={nodes}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChanged}
                onNodeDragStop={() => keep(nodes)}
                nodeDragThreshold={gridSpacing}
                panOnScroll
                panOnDrag={arr([1, 2]).concatIf(!isLocked, [0]).get()} // only pan on middle or right mouse buttons
                selectionOnDrag
                selectionMode={SelectionMode.Partial}
            >
                <Background gap={gridSpacing} />

                <Box
                    pos="absolute"
                    bottom={rem(36)}
                    left="50%"
                    w="100%"
                    style={{
                        transform: "translate(-50%, 0px)",
                        zIndex: 10,
                    }}
                >
                    <Group justify="space-between" px="xl" w="100%">
                        <ActionIcon.Group>
                            <ActionIcon variant="default" size="lg" onClick={undo} disabled={!canUndo}>
                                <Undo2 size={16} />
                            </ActionIcon>
                            <ActionIcon variant="default" size="lg" onClick={redo} disabled={!canRedo}>
                                <Redo2 size={16} />
                            </ActionIcon>
                            <Tooltip label={isLocked ? "Unlock to pan around the classroon" : "Lock to disable panning"}>
                                <ActionIcon variant="default" size="lg" onClick={() => setIsLocked((l) => !l)}>
                                    {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
                                </ActionIcon>
                            </Tooltip>
                        </ActionIcon.Group>
                        <Group>
                            <Select
                                disabled={selected.length == 0 || !selected.every((it) => it.type == "SEAT")}
                                searchable
                                value={selected.at(0)?.data["podId"]}
                                data={pods.map((pod) => ({ value: pod.id, label: pod.title }))}
                                onChange={(v) => v && handleSetPodForSelectedNode(v)}
                            />
                            <ActionIcon.Group>
                                <Tooltip label="Duplicate" onClick={handleDuplicateSelectedNode} disabled={!selected}>
                                    <ActionIcon variant="default" color="red" size="lg" disabled={!selected}>
                                        <Copy size={16} />
                                    </ActionIcon>
                                </Tooltip>
                                <Tooltip label="Delete" disabled={!selected}>
                                    <ActionIcon variant="default" size="lg" onClick={handleDeleteSelected} disabled={!selected}>
                                        <Trash size={16} />
                                    </ActionIcon>
                                </Tooltip>
                            </ActionIcon.Group>
                        </Group>
                    </Group>
                </Box>
            </ReactFlow>
        </Paper>
    );
};

const SeatNode = ({ selected, data }: { selected: boolean; data: { podId: string } }) => {
    const form = useClassroomFormContext();
    const pods = useFormSubscription(form, "pods");

    const backgroundColor = pods.find((it) => it.id == data.podId)?.hex;

    return (
        <>
            <div
                style={{
                    padding: "20px",
                    backgroundColor,
                    height: "100%",
                    border: "solid 1px",
                    borderRadius: "1px",
                    borderColor: selected ? "var(--mantine-primary-color-filled)" : "var(--mantine-color-gray-outline)",
                }}
            />
        </>
    );
};

const EntityNode = ({ selected }: { selected: boolean }) => {
    return (
        <>
            <div
                style={{
                    padding: "10px 40px",
                    height: "100%",
                    border: "solid 1px",
                    borderRadius: "4px",
                    borderColor: selected ? "var(--mantine-primary-color-filled)" : "var(--mantine-color-gray-outline)",
                }}
            >
                whiteboard
            </div>
        </>
    );
};
