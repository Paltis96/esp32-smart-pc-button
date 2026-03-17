import { Show, type Component } from "solid-js";
import {
  createForm,
  required,
  SubmitHandler,
  pattern,
  getValues,
} from "@modular-forms/solid";

import TextInput from "../../components/TextInput";
import SwitchField from "../../components/SwitchField";
import Button from "../../components/Button";
import CardBase from "./CardBase";
import CardList from "./CardList";

type GeneralConfigForm = {
  auto_power_on: boolean;
  host_ip: string;
  target_ip: string;
  heartbeat_interval_s: number;
  status_sample_size: number;
  retry_delay_s: number;
  allow_power_retry_limit: boolean;
  power_retry_limit: number;
};

type FormProps = {
  onSubmit: (formData: GeneralConfigForm) => void;
  initialData: GeneralConfigForm;
};

const ConfigCardGeneral: Component<FormProps> = (props) => {
  const [GeneralConfig, { Form: GForm, Field: GField }] =
    createForm<GeneralConfigForm>({ initialValues: props.initialData });

  const powerOn = () =>
    getValues(GeneralConfig, ["auto_power_on"]).auto_power_on;


  const handleSubmit: SubmitHandler<GeneralConfigForm> = async (
    values,
    event,
  ) => {
    props.onSubmit(values);
  };

  return (
    <CardBase>
      <GForm onSubmit={handleSubmit}>
        <div class="flex mb-6 justify-between items-center">
          <h2 class="text-xl font-semibold">General</h2>
          <div class="">
            <Button type="submit" btn_type="btn-primary" label="Save" />
          </div>
        </div>
        <CardList>
          <GField name="auto_power_on" type="boolean">
            {(field, props) => (
              <SwitchField
                {...props}
                value={field.value || false}
                error={field.error}
                title="Auto Power On"
                description="Automatically power on the PC when the Network Device becomes available."
              />
            )}
          </GField>
          <Show when={powerOn()}>
            <GField
              name="host_ip"
              validate={[
                required("Enter host IP address."),
                pattern(
                  /^\d{1,3}(\.\d{1,3}){3}$/,
                  "The IP address is badly formatted.",
                ),
              ]}
            >
              {(field, props) => (
                <TextInput
                  {...props}
                  value={field.value}
                  type="text"
                  placeholder="0.0.0.0"
                  error={field.error}
                  title="Target PC IP Address"
                  description="IP address used to check whether the PC is online."
                  required
                />
              )}
            </GField>
            <GField
              name="target_ip"
              validate={[
                required("Enter target IP address."),
                pattern(
                  /^\d{1,3}(\.\d{1,3}){3}$/,
                  "The IP address is badly formatted.",
                ),
              ]}
            >
              {(field, props) => (
                <TextInput
                  {...props}
                  value={field.value}
                  type="text"
                  placeholder="0.0.0.0"
                  error={field.error}
                  title="Target IP address"
                  description="The IP address of the target device to monitor"
                  required
                />
              )}
            </GField>
            <GField
              name="heartbeat_interval_s"
              type="number"
              validate={[required("Enter Heartbeat interval.")]}
            >
              {(field, props) => (
                <TextInput
                  {...props}
                  value={field.value}
                  type="number"
                  min="10"
                  placeholder="10"
                  error={field.error}
                  title="Ping Interval"
                  description="Time interval in seconds between checks of the monitored devices."
                  required
                />
              )}
            </GField>
            <GField
              name="retry_delay_s"
              type="number"
              validate={[required("Enter the value.")]}
            >
              {(field, props) => (
                <TextInput
                  {...props}
                  value={field.value}
                  type="number"
                  min="1"
                  placeholder="120"
                  error={field.error}
                  title="Power Retry Delay"
                  description="Time in seconds to wait before sending another power signal if the PC did not turn on."
                  required
                />
              )}
            </GField>
            <GField
              name="status_sample_size"
              type="number"
              validate={[required("Enter the value.")]}
            >
              {(field, props) => (
                <TextInput
                  {...props}
                  value={field.value}
                  type="number"
                  min="1"
                  max="10"
                  placeholder="1"
                  error={field.error}
                  title="Status Check Count"
                  description="Number of consecutive checks used to confirm whether the device is online or offline."
                  required
                />
              )}
            </GField>
            <GField name="allow_power_retry_limit" type="boolean">
              {(field, props) => (
                <SwitchField
                  {...props}
                  value={field.value || false}
                  error={field.error}
                  title="Power On Retry Limit"
                />
              )}
            </GField>
              <GField
                name="power_retry_limit"
                type="number"
                validate={[required("Enter the value.")]}
              >
                {(field, props) => (
                  <TextInput
                    {...props}
                    value={field.value}
                    type="number"
                    min="1"
                    placeholder="1"
                    error={field.error}
                    title="Retry Limit"
                    required
                  />
                )}
              </GField>
          </Show>
        </CardList>
      </GForm>
    </CardBase>
  );
};

export default ConfigCardGeneral;
