import { splitProps, type Component, type JSX, createUniqueId } from "solid-js";
import CardListItem from "./CardListItem";

type SwitchInputProps = {
  name: string;
  title?: string;
  description?: string;
  value: boolean;
  error: string;
  required?: boolean;
  autofocus?: boolean;
  ref: (element: any) => void;
  onInput: JSX.EventHandler<HTMLInputElement, InputEvent>;
  onChange: JSX.EventHandler<HTMLInputElement, Event>;
  onBlur: JSX.EventHandler<HTMLInputElement, FocusEvent>;
};

const SwitchField: Component<SwitchInputProps> = (props) => {
  const id = createUniqueId();
  const errorId = `${id}-error`;

  const [local, inputProps] = splitProps(props, [
    "title",
    "value",
    "error",
    "description",
    "name",
    "required",
  ]);

  return (
    <CardListItem
      title={local.title || ''}
      description={local.description}
      required={local.required}
    >
      <div class="flex items-center">
        <input
          {...inputProps}
          class="toggle"
          type="checkbox"
          id={id}
          name={local.name} 
          checked={local.value}
          aria-invalid={!!local.error}
          aria-describedby={local.error ? errorId : undefined}
        />

        {local.error && (
          <div id={errorId} class="error-text">
            {local.error}
          </div>
        )}
      </div>
    </CardListItem>
  );
};

export default SwitchField;
