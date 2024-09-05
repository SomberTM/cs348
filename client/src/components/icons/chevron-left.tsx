import { Component, ComponentProps } from "solid-js";

export const ChevronLeft: Component<
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
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="m15 18-6-6 6-6" />
		</svg>
	);
};
