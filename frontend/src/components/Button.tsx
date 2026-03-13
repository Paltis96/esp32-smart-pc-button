import type { Component } from "solid-js";
import { LoadingLoop } from "./Loader";

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
      class={`primary-button ${props.btn_type || "contained"}`}
      onClick={props.onClick}
      type={props.type}
      disabled={props.disabled || false}
    >

      {props.loading ?<LoadingLoop width="16px" height="16px" /> : props.label}
    </button>
  );
};

export default Button;
