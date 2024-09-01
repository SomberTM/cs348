import clsx from "clsx";
import { Component, ComponentProps, createSignal, JSX } from "solid-js";

interface ButtonProps {
  tooltip?: JSX.Element;
}

export const Button: Component<ComponentProps<"button"> & ButtonProps> = (
  props
) => {
  const [hovered, setHovered] = createSignal(false);

  return (
    <>
      <button
        {...props}
        class={clsx(
          "relative px-4 py-1 font-semibold text-sm border rounded-lg shadow-lg shadow-zinc-100 hover:bg-stone-100 transition-colors duration-300 active:scale-[0.98]",
          props.class
        )}
        onMouseEnter={(event) => {
          setHovered(true);
          //   props.onMouseEnter?.(event);
        }}
        onMouseLeave={(event) => {
          setHovered(false);
          // props.onMouseLeave?.(event);
        }}
      >
        {props.children}
        {props.tooltip && (
          <dialog
            open={hovered()}
            class={clsx(
              "-bottom-8 absolute border border-zinc-200 rounded-lg px-2 py-1 text-xs font-normal min-w-16 transition-all duration-300"
            )}
          >
            {props.tooltip}
          </dialog>
        )}
      </button>
    </>
  );
};
