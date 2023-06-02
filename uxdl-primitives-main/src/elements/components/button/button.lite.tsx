import { onMount, Show, useMetadata, useStore } from '@builder.io/mitosis';
import type { ButtonProps, ButtonState } from './button.model';
import { buttonService } from './button.service';
import './button.css';

useMetadata({ isAttachedToShadowDom: true });

export default function Button(props: ButtonProps) {
  const state = useStore<ButtonState>({
    loaded: false,
    classes: { base: '' }
  });

  onMount(() => {
    state.loaded = true;
    state.classes = buttonService.getClasses(
      props.variant,
      props.outline,
      props.rounded,
      props.intent,
      props.disabled,
      props.className
    );
  });

  return (
    <Show when={state.loaded}>
      <button class={state.classes.base} form={props.form} type={props.type}>
        {props.children}
      </button>
    </Show>
  );
}
