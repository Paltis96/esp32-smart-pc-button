import {
  Show,
  type Component,
} from "solid-js";
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

type GeneralConfigForm = {
  auto_power_on: boolean;
  host_ip: string;
  target_ip: string;
  heartbeat_interval_s: number;
  // retries: number;
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
    <div class="card">
      <div class="card-header has-border">
        <p class="card-header-title">General</p>
      </div>
      <GForm onSubmit={handleSubmit}>
        <div class="card-content">
          <GField name="auto_power_on" type="boolean">
            {(field, props) => (
              <SwitchField
                {...props}
                value={field.value || false}
                error={field.error}
                title="Auto power on"
                description="Enable automatic power on when the device is detected"
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
                  title="Host IP address"
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
                  title="Heartbeat interval"
                  description="Time interval in seconds to ping the target device"
                  required
                />
              )}
            </GField>
            {/* <GField
              name="retries"
              type="number"
              validate={[required("Enter number of retries.")]}
            >
              {(field, props) => (
                <TextInput
                  {...props}
                  value={field.value}
                  type="number"
                  min="0"
                  placeholder="0"
                  error={field.error}
                  title="Ping retries"
                  description="Maximum retries before the device status changed"
                  required
                />
              )}
            </GField> */}
          </Show>
        </div>
        <div class="card-footer has-border">
          <Button type="submit" btn_type="contained" label="Save" />
        </div>
      </GForm>
    </div>
  );
};

export default ConfigCardGeneral;
