import TextInput from "../../components/TextInput";
import SwitchField from "../../components/SwitchField";
import Button from "../../components/Button";

import { createEffect, createSignal, Show, type Component } from "solid-js";
import {
  createForm,
  required,
  SubmitHandler,
  getValues,
} from "@modular-forms/solid";

type MQTTConfigForm = {
  enable_mqtt: boolean;
  url: string;
  port: number;
  topic: string;
  client_id: string;
  username: string;
  password: string;
};

type FormProps = {
  onSubmit: (formData: MQTTConfigForm) => void;
  initialData: MQTTConfigForm;
};
const ConfigCardMQTT: Component<FormProps> = (props) => {
  const [MQTTConfig, { Form: MQTTFrom, Field: MQTTField }] =
    createForm<MQTTConfigForm>({ initialValues: props.initialData });

  const [enableMQTT, setEnableMQTT] = createSignal(false);
  createEffect(() => {
    setEnableMQTT(getValues(MQTTConfig, ["enable_mqtt"])["enable_mqtt"]!);
  });

  const handleSubmit: SubmitHandler<MQTTConfigForm> = async (values, event) => {
    props.onSubmit(values);
  };
  return (
    <div class="card">
      <div class="card-header has-border">
        <p class="card-header-title">MQTT</p>
      </div>
      <MQTTFrom onSubmit={handleSubmit}>
        <div class="card-content">
          <MQTTField name="enable_mqtt" type="boolean">
            {(field, props) => (
              <SwitchField
                {...props}
                value={field.value || false}
                error={field.error}
                title="MQTT"
                description="Enable MQTT."
              />
            )}
          </MQTTField>
          <Show when={enableMQTT()}>
            <MQTTField
              name="url"
              validate={[required("Enter MQTT URL address.")]}
            >
              {(field, props) => (
                <TextInput
                  {...props}
                  value={field.value}
                  type="url"
                  placeholder="mqtt://example.com"
                  title="URL"
                  error={field.error}
                  required
                />
              )}
            </MQTTField>
            <MQTTField
              name="port"
              type="number"
              validate={[required("Enter MQTT port.")]}
            >
              {(field, props) => (
                <TextInput
                  {...props}
                  value={field.value}
                  type="number"
                  min="0"
                  placeholder="1883"
                  title="Port"
                  error={field.error}
                  required
                />
              )}
            </MQTTField>
            <MQTTField
              name="topic"
              validate={[required("Enter MQTT topic name.")]}
            >
              {(field, props) => (
                <TextInput
                  {...props}
                  value={field.value}
                  type="text"
                  placeholder="esppcswitch"
                  title="Topic"
                  error={field.error}
                  required
                />
              )}
            </MQTTField>
            <MQTTField
              name="client_id"
              validate={[required("Enter MQTT client ID.")]}
            >
              {(field, props) => (
                <TextInput
                  {...props}
                  value={field.value}
                  type="text"
                  placeholder="esppcswitch"
                  title="Client ID"
                  error={field.error}
                  required
                />
              )}
            </MQTTField>
            <MQTTField name="username">
              {(field, props) => (
                <TextInput
                  {...props}
                  type="text"
                  placeholder="username"
                  title="Username"
                  error={field.error}
                />
              )}
            </MQTTField>
            <MQTTField name="password">
              {(field, props) => (
                <TextInput
                  {...props}
                  value={field.value}
                  type="password"
                  placeholder="password"
                  title="Password"
                  error={field.error}
                />
              )}
            </MQTTField>
          </Show>
        </div>
        <div class="card-footer has-border">
          <Button type="submit" btn_type="contained" label="Save" />
        </div>
      </MQTTFrom>
    </div>
  );
};

export default ConfigCardMQTT;
