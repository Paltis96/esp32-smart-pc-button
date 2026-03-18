import type { ParentComponent } from "solid-js";

export interface CardListItemProps {
  title: string;
  description?: string;
  required?: boolean;
}

const CardListItem: ParentComponent<CardListItemProps> = (props) => {
  return (
    <li class="list-row">
      <div class="flex flex-col justify-center ">
        <div class="font-semibold">{props.title}</div>
        <div class="text-sm opacity-60">{props.description}</div>
      </div>
      <div></div>
      <div class="flex items-center max-w-32 md:max-w-full">
        {props.children}
      </div>
    </li>
  );
};
export default CardListItem;
