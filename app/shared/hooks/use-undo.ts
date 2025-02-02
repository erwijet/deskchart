import { useState, useCallback, useRef, useEffect } from "react";
import { Node, Edge } from "reactflow";

export function useUndo<T>(initial: T, opts: { setState: (v: T) => unknown }) {
    const [state, setState] = useState<T>(initial);
    const history = useRef<T[]>([]);
    const future = useRef<T[]>([]);

    useEffect(() => {
        opts.setState(state);
    }, [state]);

    const keep = useCallback(
        (newState: T) => {
            history.current.push(state);
            future.current = []; // Clear redo stack on new changes
            setState(newState);
        },
        [state],
    );

    const undo = useCallback(() => {
        if (history.current.length === 0) return;
        const previousState = history.current.pop()!;
        future.current.push(state);
        setState(previousState);
    }, [state]);

    const redo = useCallback(() => {
        if (future.current.length === 0) return;
        const nextState = future.current.pop()!;
        history.current.push(state);
        setState(nextState);
    }, [state]);

    return { keep, undo, redo, canUndo: history.current.length > 0, canRedo: future.current.length > 0 };
}
