import { useState, useCallback, useRef, useEffect } from "react";

export function useUndo<T>(initial: T, opts: { setState: (v: T) => unknown }) {
    const [state, setState] = useState<T>(initial);
    const history = useRef<T[]>([]);
    const future = useRef<T[]>([]);

    useEffect(() => {
        if (JSON.stringify(state) == JSON.stringify(initial)) return;
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

        setState((currentState) => {
            const previousState = history.current.pop()!;
            future.current.push(currentState);
            return previousState;
        });
    }, []);

    const redo = useCallback(() => {
        if (future.current.length === 0) return;

        setState((currentState) => {
            const nextState = future.current.pop()!;
            history.current.push(currentState);
            return nextState;
        });
    }, []);

    return { keep, undo, redo, canUndo: history.current.length > 0, canRedo: future.current.length > 0 };
}
