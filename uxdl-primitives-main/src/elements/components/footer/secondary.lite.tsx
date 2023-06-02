import { onMount, Show, useMetadata, useStore } from '@builder.io/mitosis';
import type { SecondaryProps, SecondaryState } from './secondary.model';
import { secondaryService } from './secondary.service';
import './secondary.css';

useMetadata({ isAttachedToShadowDom: true });

export default function Secondary(props: SecondaryProps) {
  const state = useStore<SecondaryState>({
    loaded: false,
    classes: { base: '' }
  });

  onMount(() => {
    state.loaded = true;
    state.classes = secondaryService.getClasses(props.variant, props.className);
  });

  return (
    <Show when={state.loaded}>
      <div class={state.classes.base}>
        <div class="uxdl-footer__secondary--section">
          <h4>Section Title</h4>
          <ul>
            <li>Link</li>
            <li>Link</li>
            <li>Link</li>
          </ul>
        </div>
        <div class="uxdl-footer__secondary--section">
          <h4>Section Title</h4>
          <ul>
            <li>Link</li>
            <li>Link</li>
            <li>Link</li>
          </ul>
        </div>
        <div class="uxdl-footer__secondary--section">
          <h4>Section Title</h4>
          <ul>
            <li>Link</li>
            <li>Link</li>
            <li>Link</li>
          </ul>
        </div>
        <div class="uxdl-footer__secondary--section">
          <h4>Section Title</h4>
          <ul>
            <li>Link</li>
            <li>Link</li>
            <li>Link</li>
          </ul>
        </div>
      </div>
    </Show>
  );
}
