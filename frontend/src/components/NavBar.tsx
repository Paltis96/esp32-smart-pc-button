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
    <div class="navbar">
      <div class="navbar-start"></div>
      <div class="navbar-center lg:flex">
        <ul class="menu menu-horizontal bg-base-200 rounded-md shadow-md">
          <Index each={props.tabs}>
            {(tab, index) => (
              <li
                class={activeTab() === index ? "rounded-sm menu-active" : "rounded-sm"}
                onClick={() => handleTabSelect(index)}
              >
                <a>{tab().label}</a>
              </li>
            )}
          </Index>
        </ul>
      </div>
      <div class="navbar-end"></div>
    </div>
  );
};

export default NavBar;
