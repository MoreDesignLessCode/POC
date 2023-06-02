import { useStore } from '@builder.io/mitosis';
import type { BaseProps } from '~/models';
import './trigger.css';

export default function Trigger(props: BaseProps) {
  const state = useStore({
    toggleSidebar() {
      // const sidebarRoot = document.querySelector('.uxdl-sidebar__root');
      const layout = document.querySelector('.layout');

      if (layout.classList.contains('sidebar-closed')) {
        // sidebarRoot.classList.remove('uxdl-sidebar__root--hide');
        layout.classList.remove('sidebar-closed');
      } else {
        // sidebarRoot.classList.add('uxdl-sidebar__root--hide');
        layout.classList.add('sidebar-closed');
      }
    }
  });

  return (
    <div
      class={`uxdl-sidebar__trigger ${props.className}`}
      tabIndex={0}
      onClick={() => state.toggleSidebar()}
      onKeyDown={(event) => event.key === 'Enter' && state.toggleSidebar()}
    >
      {props.children}
    </div>
  );
}
