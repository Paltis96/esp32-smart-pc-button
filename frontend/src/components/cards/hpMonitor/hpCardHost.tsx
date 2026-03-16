import { type ParentComponent } from "solid-js";
import HpStatusBar from "./hpStatusBar";
import Badge from "../../Badge";
import CardBase from "../CardBase";
interface CardProps {
  name?: string;
  url?: string;
  hpList?: boolean[];
}

const HpCardHost: ParentComponent<CardProps> = (props) => {
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
    <CardBase>
      <div class="flex justify-between mb-2">
        <div>
          <h2 class="text-2xl font-bold">{props.name}</h2>
          <span class="text-md opacity-60"> {props.url || ""} </span>
        </div>
        <div class="flex flex-col w-20  gap-2">
          <div class=" self-end">
            <Badge type={bageType(hpStatus())}>{hpStatus()}</Badge>
          </div>
          <HpStatusBar hpList={props.hpList || []} />
        </div>
      </div>
      <div class="grid md:grid-cols-2 gap-2 ">{props.children}</div>
    </CardBase>
  );
};

export default HpCardHost;
