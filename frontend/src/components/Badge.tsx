import type { ParentComponent } from "solid-js";

export type BageStatus = "success" | "error" | "warning" | "info";

const Badge: ParentComponent<{ type?: BageStatus }> = (props) => {
  return (
    <span
      class={`badge badge-soft ${props.type}`}
    >
      {props.children}
    </span>
  );
};

export default Badge;
