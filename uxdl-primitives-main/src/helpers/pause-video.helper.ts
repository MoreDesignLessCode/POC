export function pauseVideo(event) {
  const iframe = document.querySelector('iframe');
  const video = document.querySelector('video');

  if (iframe) {
    const iframeSrc = iframe.src;
    iframe.src = iframeSrc;
  }

  if (video) {
    video.pause();
  }
}
