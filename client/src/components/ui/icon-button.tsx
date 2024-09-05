import { Component, ComponentProps } from "solid-js";
import { Button } from "./button";
import clsx from "clsx";

export const IconButton: Component<ComponentProps<typeof Button>> = (props) => {
	return (
		<Button
			{...props}
			class={clsx("border-none px-1 py-1 shadow-none", props.class)}
		/>
	);
};
