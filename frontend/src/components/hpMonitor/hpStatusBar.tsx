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
    status = status.map((val) => (val ? "up" : "down"));

    while (status.length < targetLength) {
      status.unshift("none");
    }
    return status;
  };
  return (
    <div class="hp-bar">
      <For each={hpBar(props.hpList, 10)}>
        {(item, index) => <div class={"hp-item " + item}></div>}
      </For>
    </div>
  );
};
export default HpStatusBar;
