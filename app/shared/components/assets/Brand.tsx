import classes from "shared/components/assets/Brand.module.css";

export const Brand = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
            <g id="Layer_2" data-name="Layer 2">
                <circle className={classes["cls-3"]} cx="200" cy="200" r="200" />
                <g transform="translate(20, 20)">
                    <path className={classes["cls-1"]} d="M164.28,103.76l94.3,37.87" />
                    <path className={classes["cls-1"]} d="M132.96,116.17l94.42,37.93" />
                    <path className={classes["cls-1"]} d="M101.53,128.63l94.53,38" />
                    <path className={classes["cls-1"]} d="M195.61,103.86l-94.07,37.34" />
                    <path className={classes["cls-1"]} d="M227.01,116.47l-93.95,37.41" />
                    <path className={classes["cls-1"]} d="M258.44,129.08l-93.83,37.48" />
                </g>
            </g>
            <g id="Layer_1" data-name="Layer 1" transform="translate(20, 20)">
                <path className={classes["cls-2"]} d="M330.84,135.34l-150.38-60.15L30.08,135.34l150.38,60.15,150.38-60.15v90.23" />
                <path className={classes["cls-2"]} d="M90.23,159.4v81.21c0,24.92,40.4,45.11,90.23,45.11s90.23-20.2,90.23-45.11v-81.21" />
            </g>
        </svg>
    );
};
