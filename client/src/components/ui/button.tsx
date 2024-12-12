import clsx from "clsx";
import { Component, ComponentProps, JSX } from "solid-js";
import { cn } from "../../utils/cn";

const colors = {
	blue: "bg-sky-500 text-white hover:bg-sky-500/90 border-sky-600",
} as const;

interface ButtonProps {
	tooltip?: JSX.Element;
	color?: keyof typeof colors;
}

export const Button: Component<
	Omit<ComponentProps<"button">, "color"> & ButtonProps
> = (props) => {
	return (
		<>
			<button
				{...props}
				class={cn(
					"rounded-lg border px-4 py-1 text-sm font-semibold shadow-lg shadow-zinc-100 transition-colors duration-300 hover:bg-stone-100 active:scale-[0.98]",
					props.class,
					!!props.color && colors[props.color],
				)}
			>
				{props.children}
			</button>
		</>
	);
};
