import type { ParentComponent } from "solid-js";

export interface CardRowProps {
  title: string;
  description?: string;
  required?: boolean;
}

const CardRow: ParentComponent<CardRowProps> = (props) => {
  return (
    <div class="input-group">
      <div class="input-description-wrapper">
        <div class={"input-title " + (props.required ? "required" : "")}>
          {props.title}
        </div>
        <div class="input-description">
         {props.description}
        </div>
      </div>
      {props.children}
    </div>
  );
};
export default CardRow;