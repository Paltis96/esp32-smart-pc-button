import type { Component } from "solid-js";

const Button: Component<{
  onClick?: () => void;
  label?: string;
  type?: "submit" | "reset" | "button" | "menu" | undefined;
  btn_type?: string | undefined;
  loading?: boolean;
  disabled?: boolean;
}> = (props) => {
  return (
    <button
      class={`btn btn-sm ${props.btn_type}`}
      onClick={props.onClick}
      type={props.type}
      disabled={props.disabled || false}
    >
      {props.loading ? (
        <span class="loading loading-spinner"></span>
      ) : (
        props.label
      )}
    </button>
  );
};

export default Button;
