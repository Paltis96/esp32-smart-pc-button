import {
  createResource,
  createSignal,
  Match,
  Show,
  Switch,
  type Component,
} from "solid-js";

import { api } from "../api/api";
import ConfigCardGeneral from "../components/cards/ConfigCardGeneral";
import { showToast } from "solid-notifications";
import { useDevice } from "../store/deviceStore";

const ConfigurationPage: Component = () => {
  const ctx = useDevice();


  const handleSubmit = async (values: any) => {
    try {
      const res = await api.updateConfig(values);
      showToast(res.message, { type: "success" });
      ctx?.setConfig(values);
      ctx?.refreshConfig();
    } catch (error) {
      if (error instanceof Error) showToast(error.message, { type: "error" });
    }
  };
  return (
    <>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 m-2">
        <div class="col-span-1 col-start-1 md:col-span-2  md:col-start-2">
          <Show when={ctx?.config.data}>
            <ConfigCardGeneral
              initialData={ctx?.config!.data!}
              onSubmit={handleSubmit}
            />
          </Show>
        </div>
      </div>
    </>
  );
};

export default ConfigurationPage;
