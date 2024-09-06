import { Component, ComponentProps } from "solid-js";
import { logout } from "../api/authentication";
import { Button } from "./ui/button";

interface LogoutProps {
	onLogout?(): void;
}

export const Logout: Component<
	LogoutProps & Omit<ComponentProps<typeof Button>, "onClick">
> = (props) => {
	return (
		<Button
			{...props}
			onClick={async () => {
				await logout();
				props.onLogout?.();
				window.location.search = "";
			}}
		>
			Logout
		</Button>
	);
};
