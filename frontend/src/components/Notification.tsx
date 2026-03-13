import type { ParentComponent } from "solid-js";

type NotificationProps = {
  type: "success" | "error" | "info";
};

const Notification: ParentComponent<NotificationProps> = (props) => {
  return (
    <div class="alert-container">
      <div class={`alert alert-${props.type}`}>{props.children}</div>
    </div>
  );
};

export default Notification;
