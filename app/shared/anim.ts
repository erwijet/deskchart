const animations = {
    wiggle: {
        animate: {
            rotate: [0, -10, 10, -8, 8, -5, 5, 0],
        },

        transition: {
            duration: 0.8,
            ease: "easeInOut",
        },
    },
};

export function getMotionProps<K extends keyof typeof animations>(k: K): (typeof animations)[K] {
    return animations[k];
}
