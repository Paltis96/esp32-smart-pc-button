import {
  createResource,
  createSignal,
  Match,
  Switch,
  type Component,
} from "solid-js";

import { api } from "../api/api";
import ConfigCardGeneral from "../components/cards/ConfigCardGeneral";
import Notification from "../components/Notification";
import { LoadingLoop } from "../components/Loader";
import { showToast } from "solid-notifications";
import { useDevice } from "../store/deviceStore";

const ConfigurationPage: Component = () => {
  const ctx = useDevice();

  const [firstInit, setFirstInit] = createSignal(true);

  const handleSubmit = async (values: any) => {
    try {
      const res = await api.updateConfig(values);
      showToast(res.message, { type: "success" });
      setFirstInit(false);
      ctx?.setConfig(values);
       ctx?.refreshConfig()
    } catch (error) {
      if (error instanceof Error) showToast(error.message, { type: "error" });
    }
  };
  return (
    <div class="container">
      <div class="section">
        <Switch>
          <Match when={ctx?.config.status === "error"}>
            <Notification type="error">
              <span>Error: {ctx?.config.message}</span>
            </Notification>
          </Match>
          <Match when={!ctx?.config.data && firstInit()}>
            <div class="card-loader">
              <LoadingLoop />
              <p>Loading...</p>
            </div>
          </Match>

          <Match when={ctx?.config.data}>
            <ConfigCardGeneral
              initialData={ctx?.config!.data!}
              onSubmit={handleSubmit}
            />
          </Match>
        </Switch>
      </div>
    </div>
  );
};

export default ConfigurationPage;
