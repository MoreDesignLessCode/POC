import { onMount, onUpdate, Show, useMetadata, useStore, useRef } from '@builder.io/mitosis';
import Prism from 'prismjs';
import type { RootProps, RootState } from './root.model';
import { rootService } from './root.service';
import './root.css';

useMetadata({ isAttachedToShadowDom: true });

export default function Root(props: RootProps) {
  const codeRef = useRef<HTMLElement>();
  const state = useStore<RootState>({
    loaded: false,
    classes: { base: 'uxdl-code__root' }
  });

  async function highlight() {
    console.log('pre codeRef');
    if (codeRef) {
      console.dir('highlighting;');
      Prism.highlightElement(codeRef as Element);
    }
  }

  onMount(() => {
    state.loaded = true;
    state.classes = rootService.getClasses(props.variant, props.className);
  });

  onUpdate(() => {
    if (!state.loaded) return;

    highlight();
  }, [state.loaded, props.source, props.language]);

  return (
    <Show when={state.loaded}>
      <pre class={state.classes.base}>
        <code class={props.language ? `language-${props.language}` : ''} ref={codeRef}>
          {props.source || props.children}
        </code>
      </pre>
    </Show>
  );
}
