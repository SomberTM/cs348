import { Accessor, Component, createEffect, JSX } from "solid-js";
import { IconButton } from "./icon-button";

interface DialogProps {
	open: Accessor<boolean>;
	title: string;
	onClose?: () => void;
	children: JSX.Element;
}

export const Dialog: Component<DialogProps> = (props) => {
	let dialogRef: HTMLDialogElement | undefined;

	function onOpen() {
		dialogRef?.showModal();
	}

	function onClose() {
		dialogRef?.close();
	}

	createEffect(() => {
		if (props.open()) onOpen();
		else onClose();
	});

	return (
		<dialog
			ref={dialogRef}
			onClose={() => {
				onClose();
				props.onClose?.();
			}}
			class="rounded-lg border border-zinc-200 p-4 shadow-lg shadow-zinc-200"
		>
			<div class="flex flex-col gap-4">
				<div class="flex items-center justify-between gap-1">
					<h1 class="text-xl font-bold">{props.title}</h1>
					<IconButton
						onClick={() => {
							onClose();
							props.onClose?.();
						}}
					>
						X
					</IconButton>
				</div>
				{props.children}
			</div>
		</dialog>
	);
};
