import { Index, createSignal, type Component } from "solid-js";

interface TabItem {
  label: string;
  value: Component;
}

interface NavBarProps {
  tabs?: TabItem[];
  onTabSelect?: (value: number) => void;
}

const NavBar: Component<NavBarProps> = (props) => {
  const [activeTab, setActiveTab] = createSignal(0);

  const handleTabSelect = (value: number) => {
    setActiveTab(value);
    props.onTabSelect?.(value);
  };

  return (
    <div class="navbar fixed top-0 left-0 z-10 bg-base-200 shadow-xl border-b border-white/5">
      <div class="navbar-start"></div>
      <div class="navbar-center lg:flex">
        <ul class="menu menu-horizontal ">
          <div role="tablist" class="tabs tabs-box tabs-sm bg-base-300" >
            <Index each={props.tabs}>
              {(tab, index) => (
                <a
                  role="tab"
                  class={activeTab() === index ? "tab tab-active" : "tab"}
                  onClick={() => handleTabSelect(index)}
                >
                  {tab().label}
                </a>
              )}
            </Index>
          </div>
        </ul>
      </div>
      <div class="navbar-end"></div>
    </div>
  );
};

export default NavBar;
