import { createSignal, Match, Show, Switch, type Component } from "solid-js";
import { Dynamic } from "solid-js/web";
import { ToastProvider, Toaster } from "solid-notifications";
import DashboardPage from "./pages/Dashboard";
import ConfigurationPage from "./pages/Configuration";
import NavBar from "./components/NavBar";

import { DeviceProvider, useDevice } from "./store/deviceStore";
import Preloader from "./components/Preloader";

const options = [
  { label: "Dashboard", value: DashboardPage },
  { label: "Configuration", value: ConfigurationPage },
];

const [selectedPage, setSelectedPage] = createSignal(0);

const App: Component = () => {

  return (
    <>
      <DeviceProvider>
        <ToastProvider theme="dark" offsetY={64}>
          <Toaster />
          <Show when={selectedPage() !== 3}>
            <NavBar
              tabs={options}
              onTabSelect={(value) => setSelectedPage(value)}
            />
          </Show>
          <div class="max-w-5xl mx-auto pt-18">
            <Preloader />
            <Dynamic component={options[selectedPage()].value} />
          </div>
        </ToastProvider>
      </DeviceProvider>
    </>
  );
};

export default App;
