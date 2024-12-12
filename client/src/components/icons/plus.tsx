import { Component, ComponentProps } from "solid-js";

export const Plus: Component<
	Omit<ComponentProps<"svg">, "xmlns" | "viewBox">
> = (props) => {
	return (
		<svg
			width="24"
			height="24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
		>
			<path d="M5 12h14" />
			<path d="M12 5v14" />
		</svg>
	);
};
