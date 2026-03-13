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
      <div class="navbar-start">
      </div>
      <ul class="tabs">
        <Index each={props.tabs}>
          {(tab, index) => (
            <li
              class={activeTab() === index ? "is-active" : ""}
              onClick={() => handleTabSelect(index)}
            >
              <a>{tab().label}</a>
            </li>
          )}
        </Index>
      </ul>
    </div>
  );
};

export default NavBar;
