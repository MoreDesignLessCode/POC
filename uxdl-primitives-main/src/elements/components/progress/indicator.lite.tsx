import { onMount, Show, useMetadata, useStore } from '@builder.io/mitosis';
import type { IndicatorProps, IndicatorState } from './indicator.model';
import { indicatorService } from './indicator.service';
import './indicator.css';

useMetadata({ isAttachedToShadowDom: true });

export default function Indicator(props: IndicatorProps) {
  const state = useStore<IndicatorState>({
    loaded: false,
    classes: { base: '' }
  });

  onMount(() => {
    state.loaded = true;
    state.classes = indicatorService.getClasses(props.variant, props.rounded, props.className);
  });

  return (
    <Show when={state.loaded}>
      <div class={state.classes.base} style={{ width: `${props.value}%` }}></div>
    </Show>
  );
}
