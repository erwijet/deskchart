import "react-resizable/css/styles.css";
import "reactflow/dist/style.css";

import { useEffect, useMemo } from "react";
import ReactFlow, { Background, useNodesState } from "reactflow";

import { Paper } from "@mantine/core";
import { useLayoutFormContext } from "shared/components/layout/context";

const gridSpacing = 10;

// const initialNodes = [
//     {
//         id: "1",
//         type: "resizableNode",
//         data: { hex: "#8cabaa", flag: undefined, podId: "" },
//         position: { x: 100, y: 100 },
//         draggable: true,
//     },
//     {
//         id: "2",
//         type: "resizableNode",
//         data: { hex: "#8cabaa", flag: undefined, podId: "" },
//         position: { x: 60, y: 60 },
//         draggable: true,
//     },
// ];

export const SeatsEditor = () => {
    const form = useLayoutFormContext();
    const [nodes, , onNodesChanged] = useNodesState([]);

    useEffect(() => {
        form.setFieldValue(
            "seats",
            nodes.map((node) => ({ row: node.position.x, col: node.position.y, flag: node.data.flag, podId: node.data.podId })),
        );
    }, [JSON.stringify(nodes)]);

    useEffect(() => {
        document.querySelector(".react-flow__panel")?.remove();
    }, []);

    const nodeTypes = useMemo(() => ({ resizableNode: ResizableNode }), []);

    return (
        <Paper h="66vh" w="100%" withBorder shadow="md">
            <ReactFlow nodes={nodes} onNodesChange={onNodesChanged} nodeTypes={nodeTypes} snapToGrid snapGrid={[gridSpacing, gridSpacing]}>
                <Background gap={gridSpacing} />
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
