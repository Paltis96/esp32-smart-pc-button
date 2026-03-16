import { type ParentComponent } from "solid-js";

const CardBase: ParentComponent = (props) => {
  return (
    <div class="card bg-base-200 shadow-sm">
      <div class="card-body">{props.children}</div>
    </div>
  );
};

export default CardBase;
