import { For, type Component } from "solid-js";

type hpStatus = {
  hpList: boolean[];
};

const HpStatusBar: Component<hpStatus> = (props) => {
  const hpBar = (arr: any[], targetLength: number) => {
    let status = arr;
    while (status.length > targetLength) {
      status.shift();
    }
    status = status.map((val) => (val ? "bg-success" : "bg-error"));

    while (status.length < targetLength) {
      status.unshift("bg-base-300");
    }
    return status;
  };
  return (
    <div class="grid grid-cols-10 h-4 gap-1">
      <For each={hpBar(props.hpList, 10)}>
        {(item, index) => <div class={`rounded-sm  ${item}`}></div>}
      </For>
    </div>
  );
};
export default HpStatusBar;
