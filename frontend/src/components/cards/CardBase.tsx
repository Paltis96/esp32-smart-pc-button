import { type ParentComponent } from "solid-js";

const CardBase: ParentComponent = (props) => {
  return (
    <div class="card bg-base-200 shadow-sm border border-white/5">
      <div class="card-body">{props.children}</div>
    </div>
  );
};

export default CardBase;
