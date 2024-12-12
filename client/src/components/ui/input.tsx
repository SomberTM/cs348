import clsx from "clsx";
import { Component, ComponentProps, JSX } from "solid-js";
import { cn } from "../../utils/cn";

interface InputProps {
	children?: JSX.Element;
	value?: string;
	onValueChange?: (value: string) => void;
}

export const Input: Component<
	Omit<ComponentProps<"input">, "value"> & InputProps
> = ({ value, onValueChange, children, ...props }) => {
	return (
		<span class="flex flex-col">
			{children && (
				<label class="text-sm font-semibold lowercase text-stone-400">
					{children}
				</label>
			)}
			<input
				{...props}
				value={value}
				onChange={(event) => {
					onValueChange?.(event.target.value);
					// @ts-ignore
					props.onChange?.(event);
				}}
				class={cn(
					"rounded-md border border-zinc-200 px-3 py-2 text-zinc-700 outline-none focus-visible:border-zinc-400",
					props.class,
				)}
			/>
		</span>
	);
};
