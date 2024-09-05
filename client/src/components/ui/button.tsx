import clsx from "clsx";
import { Component, ComponentProps, createSignal, JSX } from "solid-js";

interface ButtonProps {
  tooltip?: JSX.Element;
}

export const Button: Component<ComponentProps<"button"> & ButtonProps> = (
  props
) => {
  return (
    <>
      <button
        {...props}
        class={clsx(
          "px-4 py-1 font-semibold text-sm border rounded-lg shadow-lg shadow-zinc-100 hover:bg-stone-100 transition-colors duration-300 active:scale-[0.98]",
          props.class
        )}
      >
        {props.children}
      </button>
    </>
  );
};
