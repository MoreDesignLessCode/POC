import { onMount, Show, useMetadata, useStore } from '@builder.io/mitosis';
import type { CheckboxProps, CheckboxState } from './checkbox.model';
import { checkboxService } from './checkbox.service';
import './checkbox.css';

useMetadata({ isAttachedToShadowDom: true });

export default function Checkbox(props: CheckboxProps) {
  const state = useStore<CheckboxState>({
    loaded: false,
    classes: { base: '' },
    handleCheckboxCheck(event) {
      const inputs = event.target.parentElement.parentElement.querySelectorAll('input');

      if (event.target.checked) {
        inputs.forEach((input) => (input.checked = true));
      } else {
        inputs.forEach((input) => (input.checked = false));
      }
    },
    handleCheckboxKeyDown(event) {
      event.preventDefault();

      event.target.click();
    }
  });

  onMount(() => {
    state.loaded = true;
    state.classes = checkboxService.getClasses(props.variant, props.className);
  });

  return (
    <Show when={state.loaded}>
      <input
        type="checkbox"
        id={props.id}
        name={props.name}
        value={props.value}
        defaultChecked
        class={state.classes.base}
        onClick={(event) => state.handleCheckboxCheck(event)}
        onKeyDown={(event) => event.key === 'Enter' && state.handleCheckboxKeyDown(event)}
      />
    </Show>
  );
}
