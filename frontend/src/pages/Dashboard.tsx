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

import { api } from "../api/api";
import ButtonField from "../components/ButtontField";
import HpCard from "../components/hpMonitor/hpCard";
import Notification from "../components/Notification";
import { LoadingLoop } from "../components/Loader";
import CardRow from "../components/CardRow";

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
  return (
    <div class="container">
      <div class="section">
        <Switch>
          <Match when={ctx?.config.loading && ctx.config.status !== "error"}>
            <div class="card-loader">
              <LoadingLoop />
              <p>Loading...</p>
            </div>
          </Match>
          <Match when={ctx?.config.status === "error"}>
            <Notification type="error">
              <span>Error: {ctx?.config.message}</span>
            </Notification>
          </Match>
          <Match when={ctx?.config.status === "success"}>
            <div class="section-title">Dashboard</div>
            <div class="dashboard-row">
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
                  <Notification type="info">
                    <span>
                      Enable Auto power on option in configuration for
                      monitoring.
                    </span>
                  </Notification>
                </Match>
              </Switch>
            </div>
            <div class="card">
              <div class="card-header">
                <div class={"badge status-" + ctx?.espStatus().toLowerCase()}>
                  ESP32 {ctx?.espStatus()}
                </div>
              </div>
              <div class="card-content">
                <Show when={ctx?.device.data}>
                  <CardRow title="Last Update">
                    <div class="input-description">
                      {ctx?.lastUpdate() || ""}
                    </div>
                  </CardRow>
                  <CardRow title="CPU Freq">
                    <div class="input-description">
                      {`${ctx?.device.data.cpu.freq_mhz} mhz` || ""}
                    </div>
                  </CardRow>
                  <CardRow title="RAM Used">
                    <div class="input-description"> {deviceRam()} %</div>
                  </CardRow>
                  <CardRow title="WIFI Signal">
                    <div class="input-description">
                      {ctx?.device.data.network.rssi || ""}
                    </div>
                  </CardRow>
                </Show>
              </div>
            </div>
            <div class="section-title">Controls</div>
            <div class="card">
              <div class="card-content">
                <div class="input-group">
                  <div class="input-description-wrapper">
                    <div class={"input-title"}>Power signal endpoint</div>
                    <div class="input-description">
                      <a href={baseUrl} target="_blank">
                        {baseUrl}
                      </a>
                    </div>
                  </div>
                </div>
                <ButtonField
                  title="Send signal"
                  description="Manually send a signal to the device."
                  label="Send"
                  loading={signalLoading()}
                  onClick={handleSignal}
                  btn_type="text-btn"
                  disabled={signalLoading()}
                />
                <ButtonField
                  title="Reboot Esp32"
                  description="Reboot esp switch."
                  label="Reboot"
                  loading={rebootLoading()}
                  onClick={handleReboot}
                  disabled={rebootLoading()}
                  btn_type="text-btn"
                />
              </div>
            </div>
          </Match>
        </Switch>
      </div>
    </div>
  );
};

export default DashboardPage;
