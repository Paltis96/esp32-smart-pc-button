import {
  createEffect,
  createSignal,
  Match,
  Show,
  Switch,
  type Component,
} from "solid-js";
import { showToast } from "solid-notifications";
import { useDevice } from "../store/deviceStore";
import Badge from "../components/Badge";
import { api } from "../api/api";
import ButtonField from "../components/ButtontField";
import HpCardTarget from "../components/cards/hpMonitor/hpCardTarget";
import Alert from "../components/Alert";
import CardListItem from "../components/cards/CardListItem";
import CardBase from "../components/cards/CardBase";
import CardList from "../components/cards/CardList";
import HpCardHost from "../components/cards/hpMonitor/hpCardHost";
import Button from "../components/Button";

const DashboardPage: Component = () => {
  const ctx = useDevice();
  const version = import.meta.env.VITE_APP_VERSION || "dev-build";

  const [rebootLoading, setRebootLoading] = createSignal(false);
  const [signalLoading, setSignalLoading] = createSignal(false);

  const handleReboot = async () => {
    try {
      const msg = await api.rebootSystem();
      setRebootLoading(true);
      showToast(msg.message, { type: "success" });
    } catch (error) {
      if (error instanceof Error) showToast(error.message, { type: "error" });
    } finally {
      setRebootLoading(false);
    }
  };

  const handleSignal = async () => {
    try {
      setSignalLoading(true);
      const msg = await api.triggerSignal();
      showToast(msg.message, { type: "success" });
    } catch (error) {
      if (error instanceof Error) showToast(error.message, { type: "error" });
    } finally {
      setSignalLoading(false);
    }
  };

  const clearRerty = () => {
    api.retryClear();
    ctx?.cleanPingMsg();
  };

  const deviceRam = () => {
    if (!ctx?.device.data) return 0;
    else {
      const { free_kb, allocated_kb } = ctx?.device.data.memory;
      const total_kb = free_kb + allocated_kb;
      const used_percent = ((allocated_kb / total_kb) * 100).toFixed(2);
      return used_percent;
    }
  };

  const bageType = (type: string): any => {
    switch (type) {
      case "Connected":
        return "badge-success";
      case "Disconnected":
        return "badge-error";

      default:
        return undefined;
    }
  };

  const ramBarColor = (val: string) => {
    const ram = parseInt(val);
    switch (true) {
      case ram > 80:
        return "progress-error";
      case ram > 50:
        return "progress-warning";
      default:
        return "progress-info";
    }
  };
  const wifiBadgeColor = (val: string) => {
    const s = val.split(" ")[0];
    switch (true) {
      case s === "Poor":
        return "badge-error";
      case s === "Fair":
        return "badge-warning";
      case s === "Good":
        return "badge-success";
      default:
        return "";
    }
  };
  return (
    <>
      <Show when={ctx?.config.status === "success"}>
        <div class="grid md:grid-flow-col md:grid-rows-3 gap-4">
          <div class="md:col-span-1 md:row-span-3">
            <Switch>
              <Match when={ctx?.config.data?.auto_power_on}>
                <HpCardHost
                  name="Target PC"
                  url={ctx?.config.data?.host_ip}
                  hpList={ctx?.ping.data.host_history}
                >
                  <Show when={ctx?.ping.data.message}>
                    <Alert type="alert-warning">
                      <div></div>
                      <div class="font-semibold">{ctx?.ping.data.message}</div>
                      <Button
                        onClick={() => clearRerty()}
                        label="Clear Counter"
                        btn_type="btn-ghost btn-warning"
                      />
                    </Alert>
                  </Show>
                  <HpCardTarget
                    name="Network Device"
                    url={ctx?.config.data?.target_ip}
                    hpList={ctx?.ping.data.target_history}
                  />
                </HpCardHost>
              </Match>
              <Match when={!ctx?.config.data?.auto_power_on}>
                <div class="col-span-2">
                  <Alert type="alert-info">
                    <span>
                      Enable Auto power on option in configuration for
                      monitoring.
                    </span>
                  </Alert>
                </div>
              </Match>
            </Switch>
          </div>
          <div class="md:col-span-1 ">
            <CardBase>
              <div class="flex mb-6">
                <h2 class="text-xl font-semibold">Controls</h2>
              </div>
              <CardList>
                <ButtonField
                  title="Press Power Button"
                  description="Simulates pressing the power button on the Target PC."
                  label="Press"
                  loading={signalLoading()}
                  onClick={handleSignal}
                  disabled={signalLoading()}
                  btn_type="btn-primary"
                />
                <ButtonField
                  title="Reboot ESP32"
                  description="Restart the ESP32 controller."
                  label="Reboot"
                  loading={rebootLoading()}
                  onClick={handleReboot}
                  disabled={rebootLoading()}
                  btn_type="btn-primary"
                />
              </CardList>
            </CardBase>
          </div>
          <div class="md:col-span-1 md:row-span-2">
            <CardBase>
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-semibold">ESP32</h2>
                <Badge type={bageType(ctx?.espStatus()!)}>
                  {ctx?.espStatus()}
                </Badge>
              </div>
              <Show when={ctx?.device.data}>
                <CardList>
                  <CardListItem title="App Version">
                    <div class="text-md opacity-60">{version}</div>
                  </CardListItem>
                  <CardListItem title="Last Update">
                    <div class="text-md opacity-60">
                      {ctx?.lastUpdate() || ""}
                    </div>
                  </CardListItem>
                  <CardListItem title="CPU Freq">
                    <div class="text-md opacity-60">
                      {`${ctx?.device.data.cpu.freq_mhz} mhz` || ""}
                    </div>
                  </CardListItem>
                  <CardListItem title="RAM Used">
                    <div class="flex flex-col items-end">
                      <div class="text-md opacity-60 mb-1">{deviceRam()} %</div>
                      <progress
                        class={`progress w-24 ${ramBarColor(deviceRam() as any)}`}
                        value={deviceRam()}
                        max="100"
                      ></progress>
                    </div>
                  </CardListItem>
                  <CardListItem title="WIFI Signal">
                    <Badge
                      type={
                        wifiBadgeColor(ctx?.device.data.network.rssi) as any
                      }
                    >
                      {ctx?.device.data.network.rssi || "None"}
                    </Badge>
                  </CardListItem>
                </CardList>
              </Show>
            </CardBase>
          </div>
        </div>
      </Show>
    </>
  );
};

export default DashboardPage;
