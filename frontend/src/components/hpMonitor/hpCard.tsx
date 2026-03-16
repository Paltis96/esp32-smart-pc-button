import { type Component } from "solid-js";
import HpStatusBar from "./hpStatusBar";
import Badge from "../Badge";
interface CardProps {
  name?: string;
  url?: string;
  hpList?: boolean[];
}

const HpCard: Component<CardProps> = (props) => {
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
    <div class="card dark:bg-neutral shadow-sm">
      <div class="card-body">
        <div class="flex justify-between">
          <div>
            <h2 class="text-2xl font-bold">{props.name}</h2>
            <span> {props.url || ""} </span>
          </div>
          <span class="text-xl">
            <Badge type={bageType(hpStatus())}>{hpStatus()}</Badge>
          </span>
        </div>
      </div>
      <HpStatusBar hpList={props.hpList || []} />
    </div>
  );
};

export default HpCard;
