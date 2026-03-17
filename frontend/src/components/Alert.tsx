import type { ParentComponent } from "solid-js";

type AlertProps = {
  type?: "alert-success" | "alert-error" | "alert-info" |  "alert-warning";
};

const Alert: ParentComponent<AlertProps> = (props) => {
  return (
    <div role="alert" class={`alert alert-horizontal  alert-soft ${props.type}`}>
      {props.children}
    </div>
  );
};

export default Alert;
