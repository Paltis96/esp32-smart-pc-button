import { type ParentComponent } from "solid-js";

const CardList: ParentComponent = (props) => {
  return (
    <ul class="list bg-base-100 rounded-box shadow-sm border border-white/5">
      {props.children}
    </ul>
  );
};

export default CardList;
