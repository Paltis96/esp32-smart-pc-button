import { Match, Switch, type Component } from "solid-js";
import Alert from "./Alert";
import { useDevice } from "../store/deviceStore";

const Preloader: Component = (props) => {
  const ctx = useDevice();

  return (
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 m-2">
      <div class="col-span-1 col-start-1 md:col-span-2  md:col-start-2">
        <Switch>
          <Match when={ctx?.config.status === "error"}>
            <Alert type="alert-error">
              <span>Error: {ctx?.config.message}</span>
            </Alert>
          </Match>
          <Match when={ctx?.config.loading && ctx?.firstInit()}>
            <div class="flex justify-center mt-8" >
              <span class="loading loading-dots loading-md"></span>
            </div>
          </Match>
        </Switch>
       
      </div>
    </div>
  );
};

export default Preloader;
