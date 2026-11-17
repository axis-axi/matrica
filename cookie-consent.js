/* Баннер cookie + Яндекс.Метрика (счётчик 114234803).
   Счётчик запускается ТОЛЬКО после нажатия Принять. Выбор хранится в браузере. Вебвизор выключен. */
(function () {
  var KEY = 'nk_cookie_consent';
  var ID = 114234803;

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function loadMetrika() {
    if (window.__nkMetrika) return;
    window.__nkMetrika = true;
    (function (m, e, t, r, i, k, a) {
      m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
      m[i].l = 1 * new Date();
      k = e.createElement(t); a = e.getElementsByTagName(t)[0]; k.async = 1; k.src = r;
      a.parentNode.insertBefore(k, a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=' + ID, 'ym');
    window.ym(ID, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: false });
  }

  function showBanner() {
    var b = document.createElement('div');
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Файлы cookie');
    b.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:99999;max-width:640px;margin:0 auto;' +
      'background:#FCF8F1;color:#2B1B1C;box-shadow:0 8px 30px rgba(59,14,18,.25),inset 0 0 0 1px rgba(198,161,91,.5);' +
      'padding:16px 18px;font:14px/1.5 system-ui,-apple-system,Segoe UI,sans-serif';
    b.innerHTML = '<div style="margin-bottom:12px">Сайт использует файлы cookie и Яндекс Метрику, чтобы считать посещения и улучшать калькулятор. ' +
      'Расчёт по вашей дате рождения не отправляется никуда и от этого не зависит. ' +
      '<a href="/politika.html" style="color:#7A2A2E">Подробнее в политике</a></div>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
      '<button type="button" data-v="yes" style="cursor:pointer;border:0;padding:10px 22px;background:#5E1A1E;color:#F6E9D6;font:500 13px system-ui,sans-serif">Принять</button>' +
      '<button type="button" data-v="no" style="cursor:pointer;padding:10px 22px;background:transparent;color:#5E1A1E;border:1px solid #5E1A1E;font:500 13px system-ui,sans-serif">Отказаться</button>' +
      '</div>';
    b.addEventListener('click', function (ev) {
      var v = ev.target && ev.target.getAttribute && ev.target.getAttribute('data-v');
      if (!v) return;
      set(v);
      if (v === 'yes') loadMetrika();
      b.parentNode.removeChild(b);
    });
    document.body.appendChild(b);
  }

  function start() {
    var c = get();
    if (c === 'yes') loadMetrika();
    else if (c !== 'no') showBanner();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
