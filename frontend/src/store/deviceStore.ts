import { createStore, reconcile } from "solid-js/store";
import { createResource, createEffect, onCleanup, createSignal } from "solid-js";
import { createContextProvider } from "@solid-primitives/context";
import { api, type AppConfig, type PingStat } from "../api/api";

interface GenericStore {
    data?: any
    loading: boolean;
    status?: "success" | 'error' | undefined;
    message?: string | undefined
}

export type deviceStatus = "Connecting" | "Connected" | "Refreshing" | "Disconnected";


const fetchData = (storeSetter: Function, resource: any) => {
    storeSetter({ loading: resource.loading });
    if (resource.error) {
        storeSetter({
            status: "error",
            message: resource.error.message,
            loading: false
        });
        return;
    }
    const res = resource();
    if (!res) return;

    storeSetter({
        status: "success",
        message: res.message,
        data: res.data,
        loading: false
    });

}
const [DeviceProvider, useDevice] = createContextProvider(() => {

    const [configData, { refetch: refreshConfig }] = createResource(api.getConfig);
    const [pingData, { refetch: refreshPing }] = createResource(api.getPingStat);
    const [devicegData, { refetch: refreshDevice }] = createResource(api.espInfo);

    const [firstInit, setFirstInit] = createSignal(true)
    const [lastUpdate, setLastUpdate] = createSignal(new Date().toLocaleTimeString())
    const [espStatus, setEspStatus] = createSignal<deviceStatus>('Connecting')
    const [config, setConfig] = createStore<GenericStore>({
        loading: true,
        data: undefined,
        status: undefined,
        message: undefined
    });
    const [ping, setPing] = createStore<GenericStore>({
        loading: true,
        data: { host_history: [], target_history: [], message: '' },
        status: undefined,
        message: undefined
    });
    const [device, setDevice] = createStore<GenericStore>({
        loading: true,
        data: undefined,
        status: undefined,
        message: undefined
    });

    const cleanPingMsg = () => {
      setPing("data", "message", "");
    }
createEffect(() => {

    if (pingData.loading && firstInit()) {
        setEspStatus("Connecting")
    }
    else if (pingData.loading && !firstInit()) {
        setEspStatus('Refreshing')
    }
    else if (pingData.error) {
        setEspStatus("Disconnected")
        setFirstInit(false)
    }
    else if (pingData()) {
        setEspStatus("Connected")
        setFirstInit(false)

    }

    fetchData(setConfig, configData)
    fetchData(setPing, pingData)
    fetchData(setDevice, devicegData)

    setLastUpdate(new Date().toLocaleTimeString())
});

let refreshTimer: any | undefined

refreshTimer = setInterval(() => {

    if (config.status === 'error') refreshConfig()
    refreshPing()
    refreshDevice()
    setLastUpdate(new Date().toLocaleTimeString())


}, 30000);
onCleanup(() => { if (refreshTimer) clearInterval(refreshTimer) })
return { config, setConfig, refreshConfig, ping, device, espStatus, lastUpdate, firstInit, cleanPingMsg };
});

export { DeviceProvider, useDevice }
