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
import HpCard from "../components/hpMonitor/hpCard";
import Alert from "../components/Alert";
import CardListItem from "../components/CardListItem";

const DashboardPage: Component = () => {
  const baseUrl = window.location.origin + "/api/signal";
  const ctx = useDevice();

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
  return (
    <>
      <Show when={ctx?.config.status === "success"}>
        <div class="grid grid-cols-1 md:grid-cols-6 gap-4 m-2">
          <div class="col-span-1 col-start-1 md:col-span-4 md:col-start-2">
            <div class="grid md:grid-cols-2 gap-4">
              <Switch>
                <Match when={ctx?.config.data?.auto_power_on}>
                  <HpCard
                    name="Host PC"
                    url={ctx?.config.data?.host_ip}
                    hpList={ctx?.ping.data.host_history}
                  />
                  <HpCard
                    name="Target Device"
                    url={ctx?.config.data?.target_ip}
                    hpList={ctx?.ping.data.target_history}
                  />
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
          </div>
          <div class="md:col-span-2 md:col-start-2">
            <div class="card dark:bg-neutral shadow-sm">
              <div class="card-body">
                <div class="flex items-center justify-between mb-6">
                  <h2 class="text-xl font-bold">ESP32</h2>
                  <Badge type={bageType(ctx?.espStatus()!)}>
                    {ctx?.espStatus()}
                  </Badge>
                </div>
                <Show when={ctx?.device.data}>
                  <ul class="list bg-base-100 rounded-box shadow-md">
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
                        <div class="text-md opacity-60 mb-1">
                          {deviceRam()} %
                        </div>
                        <progress
                          class={`progress w-24 ${ramBarColor(deviceRam() as any)}`}
                          value={deviceRam()}
                          max="100"
                        ></progress>
                      </div>
                    </CardListItem>
                    <CardListItem title="WIFI Signal">
                      <div class="text-md opacity-60">
                        {ctx?.device.data.network.rssi || ""}
                      </div>
                    </CardListItem>
                  </ul>
                </Show>
              </div>
            </div>
          </div>
          <div class="md:col-span-2 md:col-start-4">
            <div class="card dark:bg-neutral shadow-sm">
              <div class="card-body">
                <div class="flex mb-6">
                  <h2 class="text-xl font-bold">Controls</h2>
                </div>
                <ul class="list bg-base-100 rounded-box shadow-md">
                  <ButtonField
                    title="Send signal"
                    description="Manually send a signal to the device."
                    label="Send"
                    loading={signalLoading()}
                    onClick={handleSignal}
                    btn_type="btn-ghost"
                    disabled={signalLoading()}
                  />
                  <ButtonField
                    title="Reboot Esp32"
                    description="Reboot esp switch."
                    label="Reboot"
                    loading={rebootLoading()}
                    onClick={handleReboot}
                    disabled={rebootLoading()}
                    btn_type="btn-ghost"
                  />
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </>
  );
};

export default DashboardPage;
