import { Component, ComponentProps } from "solid-js";
import { Button } from "./button";
import clsx from "clsx";
import { cn } from "../../utils/cn";

export const IconButton: Component<ComponentProps<typeof Button>> = ({
	children,
	...props
}) => {
	return (
		<Button
			{...props}
			class={cn(
				"relative aspect-square w-8 border-none px-1 py-1 shadow-none",
				props.class,
			)}
		>
			<span class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
				{children}
			</span>
		</Button>
	);
};
