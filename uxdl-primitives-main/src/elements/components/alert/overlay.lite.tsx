import type { BaseProps } from '~/models';
import { pauseVideo } from '~/helpers/pause-video.helper';
import './overlay.css';

export default function Overlay(props: BaseProps) {
  return <div class={`uxdl-alert__overlay ${props.className}`} onClick={(event) => pauseVideo(event)}></div>;
}
