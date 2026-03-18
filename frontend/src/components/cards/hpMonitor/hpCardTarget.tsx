import { type Component } from "solid-js";
import HpStatusBar from "./hpStatusBar";
import Badge from "../../Badge";
import CardBase from "../CardBase";
interface CardProps {
  name?: string;
  url?: string;
  hpList?: boolean[];
}

const HpCardTarget: Component<CardProps> = (props) => {
  const hpStatus = () => {
    if (props.hpList?.length == 0 || !props.hpList) return "none";
    return props.hpList[props.hpList.length - 1] ? "Up" : "Down";
  };

  const bageType = (type: string): any => {
    switch (type) {
      case "Up":
        return "badge-success";
      case "Down":
        return "badge-error";

      default:
        return undefined;
    }
  };
  return (
    <div class="card bg-base-100 shadow-sm border border-white/5">
      <div class="card-body">
        <div class="flex justify-between">
          <div>
            <h2 class="text-lg font-semibold">{props.name}</h2>
            <span class="opacity-60"> {props.url || ""} </span>
          </div>
          <div class="flex flex-col w-20 gap-2">
            <div class="self-end">
              <Badge type={bageType(hpStatus())}>{hpStatus()}</Badge>
            </div>
            <HpStatusBar hpList={props.hpList || []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HpCardTarget;
