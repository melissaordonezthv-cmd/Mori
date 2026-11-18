/**
 * Returns the public/shareable URL for the app.
 * When accessed from a private development preview host (ais-dev-*),
 * converts it to the public shared preview host (ais-pre-*) so other people can open it.
 */
export function getShareableAppUrl(): string {
  if (typeof window === 'undefined') return '';
  const { protocol, host, origin } = window.location;
  if (host.startsWith('ais-dev-')) {
    return `${protocol}//${host.replace(/^ais-dev-/, 'ais-pre-')}`;
  }
  return origin;
}

export async function copyTextSafely(text: string): Promise<boolean> {
  if (!text) return false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall back to textarea selection copy when iframe permissions block clipboard API
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    const copied = document.execCommand('copy');
    document.body.removeChild(textarea);
    return copied;
  } catch {
    return false;
  }
}
