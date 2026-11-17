/* Оформление калькуляторов: искры, появление блоков, орнамент, счётчик чисел.
   Ничего не ломает: если скрипт не сработал, страница остаётся рабочей. */
(function(){
"use strict";
try{
  var ONLY = !!window.DC_ONLY_PREP;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* орнамент под заголовком */
  var top = document.querySelector(".top");
  if(!ONLY && top && !top.querySelector(".dc-orn")){
    var orn = document.createElement("div");
    orn.className = "dc-orn";
    orn.innerHTML = "<span></span><i>✦</i><span></span>";
    var lead = top.querySelector(".lead");
    if(lead) top.insertBefore(orn, lead); else top.appendChild(orn);
  }

  /* искры на фоне */
  if(!reduce && !ONLY){
    var sky = document.createElement("div");
    sky.className = "dc-sky";
    sky.setAttribute("aria-hidden", "true");
    var chars = ["✦", "✧", "✶", "·"];
    var n = window.innerWidth < 600 ? 12 : 22;
    for(var i = 0; i < n; i++){
      var s = document.createElement("i");
      s.className = "dc-spark";
      s.textContent = chars[i % chars.length];
      var size = 9 + Math.round(Math.random() * 14);
      s.style.cssText = "left:" + (Math.random() * 100).toFixed(1) + "%;font-size:" + size + "px;" +
        "--dx:" + Math.round((Math.random() - .5) * 90) + "px;--op:" + (0.28 + Math.random() * .38).toFixed(2) + ";" +
        "animation-duration:" + (22 + Math.random() * 26).toFixed(1) + "s," + (5 + Math.random() * 6).toFixed(1) + "s;" +
        "animation-delay:-" + (Math.random() * 30).toFixed(1) + "s,-" + (Math.random() * 6).toFixed(1) + "s";
      sky.appendChild(s);
    }
    document.body.insertBefore(sky, document.body.firstChild);
  }

  /* появление блоков при прокрутке */
  var io = null;
  if(!ONLY && "IntersectionObserver" in window && !reduce){
    io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add("dc-on"); io.unobserve(e.target); }
      });
    }, {rootMargin:"0px 0px -8% 0px", threshold:.06});
  }
  var SEL = ".card, .sov-sec, .sov-group";
  function watch(root){
    var list = (root.matches && root.matches(SEL)) ? [root] : [];
    if(root.querySelectorAll) list = list.concat([].slice.call(root.querySelectorAll(SEL)));
    list.forEach(function(el){
      if(el.__dc) return; el.__dc = 1;
      if(!io){ return; }
      el.classList.add("dc-rv");
      io.observe(el);
    });
  }
  if(!ONLY) watch(document.body);

  /* страховка: через 3 секунды всё показываем */
  setTimeout(function(){
    [].forEach.call(document.querySelectorAll(".dc-rv:not(.dc-on)"), function(el){ el.classList.add("dc-on"); });
  }, 3000);

  /* счётчик чисел и новые блоки результата */
  function countUp(el){
    if(el.__cnt) return; el.__cnt = 1;
    var raw = el.textContent.trim();
    if(!/^\d{1,3}$/.test(raw) || reduce) return;
    var to = +raw, t0 = null, dur = 900 + Math.random() * 300;
    el.textContent = "0";
    function step(ts){
      if(!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      el.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if(p < 1) requestAnimationFrame(step); else el.textContent = raw;
    }
    requestAnimationFrame(step);
  }
  var mo = ONLY ? null : new MutationObserver(function(muts){
    muts.forEach(function(m){
      [].forEach.call(m.addedNodes, function(nd){
        if(nd.nodeType !== 1) return;
        watch(nd);
        if(nd.matches && nd.matches(".disc")) countUp(nd);
        [].forEach.call(nd.querySelectorAll ? nd.querySelectorAll(".disc") : [], countUp);
      });
    });
  });
  var res = document.getElementById("result") || document.getElementById("sov-result") || document.body;
  if(mo) mo.observe(res, {childList:true, subtree:true});

  /* ---- анимация «разбор готовится»: показывается, когда человек ввёл данные и разбор построен ---- */
  var resEls = ["result", "sov-result", "mxResult", "brResult"].map(function(i){ return document.getElementById(i); }).filter(Boolean);
  if(resEls.length){
    var lastSig = null, busy = false;
    var STEPS = ["Считаю ваши числа", "Раскладываю энергии по точкам", "Читаю, что они говорят", "Собираю ваш разбор"];
    function visible(el){
      if(el.hidden) return false;
      var cs = window.getComputedStyle(el);
      return cs.display !== "none" && cs.visibility !== "hidden";
    }
    function sig(){
      var v = [].map.call(document.querySelectorAll("input"), function(i){ return i.value; }).join("|");
      var g = [].map.call(document.querySelectorAll(".gen button.on, #gender button.on, #gender [aria-pressed=true], #gender .on"), function(b){ return b.textContent; }).join("|");
      var q = [].map.call(document.querySelectorAll("button.on, button.is-on"), function(b){ return b.textContent; }).join("|");
      return v + "#" + g + "#" + q;
    }
    function showPrep(resEl){
      if(busy) return; busy = true;
      var dur = reduce ? 700 : 3000;
      var title = (document.body && document.body.getAttribute("data-prep")) || "Готовим ваш разбор";
      var d2 = document.getElementById("mxDate2");
      if(resEl.id === "brResult") title = "Готовим разбор вашего личного бренда";
      else if(resEl.id === "mxResult" && d2 && d2.value && d2.offsetParent !== null) title = "Готовим разбор вашей пары";
      var ov = document.createElement("div");
      ov.className = "dc-prep";
      ov.style.setProperty("--dc-dur", dur + "ms");
      var nums = "";
      for(var i = 0; i < 9; i++){
        var a = (i / 9) * Math.PI * 2, r = 92 + (i % 2) * 14;
        nums += '<span class="dc-num" style="left:calc(50% + ' + Math.round(Math.cos(a) * r * 1.5) + 'px - 10px);top:calc(50% + ' + Math.round(Math.sin(a) * r * 0.72) + 'px - 14px);animation-delay:-' + (i * 0.27).toFixed(2) + 's">' + (1 + Math.floor(Math.random() * 22)) + "</span>";
      }
      ov.innerHTML = '<div class="dc-prep-in"><div class="dc-ring"><i></i><i></i><i></i><b>✦</b>' + nums + '</div>' +
        '<div class="dc-prep-t"></div><div class="dc-prep-s"></div><div class="dc-bar"><span></span></div></div>';
      ov.querySelector(".dc-prep-t").textContent = title;
      document.body.appendChild(ov);
      var de = document.documentElement, prevOv = de.style.overflow;
      de.style.overflow = "hidden";
      var st = ov.querySelector(".dc-prep-s"), k = 0;
      st.textContent = STEPS[0];
      var iv = reduce ? null : setInterval(function(){
        k = Math.min(k + 1, STEPS.length - 1);
        st.classList.add("dc-sw");
        setTimeout(function(){ st.textContent = STEPS[k]; st.classList.remove("dc-sw"); }, 220);
      }, Math.round(dur / 3.4));
      setTimeout(function(){
        if(iv) clearInterval(iv);
        ov.classList.add("dc-out");
        setTimeout(function(){
          if(ov.parentNode) ov.parentNode.removeChild(ov);
          de.style.overflow = prevOv;
          busy = false;
          try{ resEl.scrollIntoView({behavior:"smooth", block:"start"}); }catch(e){}
        }, 560);
      }, dur);
    }
    function check(resEl){
      if(busy) return;
      if(!visible(resEl) || (resEl.innerText || "").length < 200) return;
      var s = sig();
      if(s === lastSig) return;
      lastSig = s;
      showPrep(resEl);
    }
    resEls.forEach(function(resEl){
      var pend = false;
      new MutationObserver(function(){
        if(pend) return; pend = true;
        Promise.resolve().then(function(){ pend = false; check(resEl); });
      }).observe(resEl, {childList:true, subtree:false, attributes:true, attributeFilter:["hidden", "style", "class"]});
    });
  }
}catch(e){ if(window.console) console.warn("decor", e); }
})();
