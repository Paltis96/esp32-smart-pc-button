import type { Component } from "solid-js";
import CardRow from "./CardRow";
import { JSX, splitProps } from "solid-js";

export type TextInputProps = {
  title?: string;
  name: string;
  description?: string;
  min?: string;
  max?: string;
  type: "text" | "email" | "tel" | "password" | "url" | "date" | "number";
  placeholder?: string;
  value?: string | number | undefined;
  error?: string;
  required?: boolean;
  ref: (element: HTMLInputElement) => void;
  onInput: JSX.EventHandler<HTMLInputElement, InputEvent>;
  onChange: JSX.EventHandler<HTMLInputElement, Event>;
  onBlur: JSX.EventHandler<HTMLInputElement, FocusEvent>;
};

const TextInput: Component<TextInputProps> = (props) => {
  const [, inputProps] = splitProps(props, ["value", "error"]);

  const handleInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    if (props.type === "number") {
      const rawValue = e.currentTarget.value;
      let sanitized = rawValue === "" ? "0" : String(Number(rawValue));
      if (props.min && sanitized < props.min) sanitized = props.min;
      if (props.max && sanitized > props.max) sanitized = props.max;

      e.currentTarget.value = sanitized;
    }
    props.onInput(e);
  };

  return (
    <CardRow
      title={props.title || ""}
      description={props.description}
      required={props.required}
    >
      <div class="input-wrapper">
        <input
          class={`text-input ${props.error ? "error" : ""}`}
          {...inputProps}
          id={props.name}
          value={props.value ?? ""}
          onInput={handleInput}
          aria-invalid={!!props.error}
          aria-errormessage={`${props.name}-error`}
          min={props.min}
          max={props.max}
        />
        {props.error && (
          <div class="text-error" id={`${props.name}-error`}>
            {props.error}
          </div>
        )}
      </div>
    </CardRow>
  );
};

export default TextInput;
