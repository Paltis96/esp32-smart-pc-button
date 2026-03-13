import type { Component } from "solid-js";
import CardRow from "./CardRow";
import Button from "./Button";
export interface ButtonFieldProps {
  title: string;
  description?: string;
  label?: string;
  loading?: boolean;
  btn_type?: string;
  disabled?: boolean
  onClick: () => void;
}

const ButtonField: Component<ButtonFieldProps> = (props) => {
  return (
    <CardRow title={props.title} description={props.description}>
      <div class="input-wrapper">
        <Button
          onClick={() => props.onClick()}
          label={props.label}
          loading={props.loading}
          disabled={props.disabled || false}
          btn_type={props.btn_type}
        />
      </div>
    </CardRow>
  );
};

export default ButtonField;
