import type { BaseProps } from '~/models';
import { pauseVideo } from '~/helpers/pause-video.helper';
import './cancel.css';

export default function Cancel(props: BaseProps) {
  return (
    <div class={`uxdl-alert__cancel ${props.className}`} onClick={(event) => pauseVideo(event)}>
      {props.children}
    </div>
  );
}
