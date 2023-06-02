import { onMount, Show, useMetadata, useStore } from '@builder.io/mitosis';
import type { TriggerProps, TriggerState } from './trigger.model';
import { triggerService } from './trigger.service';
import './trigger.css';

useMetadata({ isAttachedToShadowDom: true });

export default function Trigger(props: TriggerProps) {
  const state = useStore<TriggerState>({
    loaded: false,
    classes: { base: '' },
    handleTriggerClick(event) {
      event.preventDefault();

      if (props.rotate) {
        event.target.classList.toggle(`rotate-${props.rotate}`);
      }
      event.target.parentElement.parentElement.nextElementSibling.classList.toggle('hidden');
    },
    handleTriggerKeyDown(event) {
      event.preventDefault();

      if (props.rotate) {
        event.target.children[0].classList.toggle(`rotate-${props.rotate}`);
      }
      event.target.parentElement.nextElementSibling.classList.toggle('hidden');
    }
  });

  onMount(() => {
    state.loaded = true;
    state.classes = triggerService.getClasses(props.variant, props.className);
  });

  return (
    <Show when={state.loaded}>
      <div
        class={state.classes.base}
        tabIndex={0}
        onClick={(event) => state.handleTriggerClick(event)}
        onKeyDown={(event) => event.key === 'Enter' && state.handleTriggerKeyDown(event)}
      >
        {props.children}
      </div>
    </Show>
  );
}
