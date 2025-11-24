// Utility to dynamically load the Commission Junction (CJ) script
export const CJ_SRC = 'https://www.anrdoezrs.net/am/101595768/include/allCj/sid/turvia-reservas/exclude/4347407,5096493,4297289,4347393,4297313,4347401,5013325,5095558,4347392,4297311,2942540,5566445,6774658,7538034,5338237,5338238,5121886,5261371,5256787,5261370,5263716,5289014,5289026,5289029,5288974,5289015,5288969,5289017,5289022,5289019,5289024,5288967,1874913,4750122,3412620,1702763,2612819,5275605,5275615,5275622,5275603,5275606,5275598,5275609,4687839,5275619,5275623,5275610,5275614,5275628,5275597/impressions/page/am.js';

const IS_PRODUCTION = (process.env.NODE_ENV === 'production');

export function loadCJScript() {
  if (typeof window === 'undefined') return;
  // Only load CJ in production builds by default
  if (!IS_PRODUCTION) {
    // Allow local testing by keeping this check; developers can set NODE_ENV=production locally if needed
    // eslint-disable-next-line no-console
    console.debug('Skipping CJ script load because NODE_ENV is not production');
    return;
  }

  // Avoid duplicate insertion
  if (document.querySelector(`script[src="${CJ_SRC}"]`)) {
    console.debug('[CJ] Script already present, skipping insert.');
    return;
  }

  const script = document.createElement('script');
  script.src = CJ_SRC;
  script.async = true;
  script.defer = true;
  script.crossOrigin = 'anonymous';
  script.onload = () => {
    // eslint-disable-next-line no-console
    console.log('[CJ] Script loaded successfully:', CJ_SRC);
  };
  script.onerror = (e) => {
    // eslint-disable-next-line no-console
    console.error('[CJ] Script failed to load:', CJ_SRC, e);
  };
  document.body.appendChild(script);
  // eslint-disable-next-line no-console
  console.log('[CJ] Script tag inserted:', CJ_SRC);
}

export default loadCJScript;
