import { customSwing } from "astro-vtbot/animations/swing";

//@ts-ignore
export const swingOption = {
    keyframes: { axis: { y: 1 }, angle: { leave: '90deg', enter: '-90deg' } },
    base: { duration: '300ms' },
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
