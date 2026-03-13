import { type Component } from "solid-js";
import HpStatusBar from "./hpStatusBar";
interface CardProps {
  name?: string;
  url?: string;
  hpList?: boolean[];
}

const HpCard: Component<CardProps> = (props) => {
  const hpStatus = () => {
    if (props.hpList?.length == 0 || !props.hpList) return "none";

    return props.hpList[props.hpList.length - 1] ? "up" : "down";
  };

  return (
    <div class="card">
      <div class="card-header">
        <div class="input-group">
          <div class="input-description-wrapper ">
            <div class="input-title">
              {props.name || <div class="skeleton skeleton-text short"></div>}
            </div>
            <div class="input-description">
              {props.url ? (
                <div>{props.url}</div>
              ) : (
                <div class="skeleton skeleton-text short"></div>
              )}
            </div>
          </div>
          <div class={"hp-status " + hpStatus()}>{hpStatus()}</div>
        </div>
      </div>
      <div class="card-content row">
        {props.hpList ? (
          <HpStatusBar hpList={props.hpList} />
        ) : (
          <div class="skeleton skeleton-text"></div>
        )}
      </div>
    </div>
  );
};

export default HpCard;
