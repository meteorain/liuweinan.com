import { customSwing } from "astro-vtbot/animations/swing";

//@ts-ignore
export const swingOption = {
    keyframes: { axis: { y: 2 }, angle: { leave: '50deg', enter: '-50deg' } },
    base: { duration: '200ms' },
    extensions: {
        forwards: {
            old: { 'transform-origin': 'center left' },
            new: { 'transform-origin': 'center right', 'animation-delay': '0.075s' },
        },
        backwards: {
            old: { 'transform-origin': 'center right' },
            new: { 'transform-origin': 'center left', 'animation-delay': '0.075s' },
        },
    },
}
