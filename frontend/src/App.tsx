import { createSignal, Show, type Component } from "solid-js";
import { Dynamic } from "solid-js/web";
import { ToastProvider, Toaster } from "solid-notifications";
import DashboardPage from "./pages/Dashboard";
import ConfigurationPage from "./pages/Configuration";
import NavBar from "./components/NavBar";

import { DeviceProvider } from "./store/deviceStore";

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
            <Dynamic component={options[selectedPage()].value} />
          </ToastProvider>
        </DeviceProvider>
    </>
  );
};

export default App;
