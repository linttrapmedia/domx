"use strict";(()=>{function p(n,r,t){document.querySelectorAll(r).forEach(s=>s.classList.add(t))}function v(n,r,t,e){document.querySelectorAll(r).forEach(i=>{let a=o=>{o.preventDefault(),o.target===i&&n.dispatch(e)};i.removeEventListener(t,a),i.addEventListener(t,a)})}function b(n,r,t){let e=document.querySelector(r);if(!e)return;let s=document.createElement("template");s.innerHTML=decodeURIComponent(t),e.append(s.content)}function L(n,r,t=0){clearTimeout(n.timeouts[r]),n.timeouts[r]=setTimeout(()=>n.dispatch(r),t)}function y(n,r,t,e){window.history.pushState(r,t,e)}function E(n,r){fetch(r,{method:"GET"}).then(t=>t.json().then(e=>n.transform(e)))}function S(n,r,t){let e=document.querySelector(r);!e||(e.innerHTML=decodeURIComponent(t))}function D(n,r){window.location.href=r}function w(n,r){let t=document.querySelector(r),e=new FormData(t);fetch(t.action,{body:e,method:"POST"}).then(s=>s.json().then(i=>n.transform(i)))}function x(n,r,t){let e=document.querySelector(r);!e||(e.textContent=decodeURIComponent(t))}function M(n,r,t){document.querySelectorAll(r).forEach(s=>s.removeAttribute(t))}function A(n,r,t,e){document.querySelectorAll(r).forEach(i=>{let a=o=>{o.preventDefault(),o.target===i&&n.dispatch(e)};i.removeEventListener(t,a)})}function q(n,r,t){document.querySelectorAll(r).forEach(s=>s.classList.remove(t))}function H(n,r,t){let e=document.querySelector(r);if(!e)return;let s=document.createElement("template");s.innerHTML=decodeURIComponent(t),e.replaceWith(s.content)}function C(n,r,t,e){document.querySelectorAll(r).forEach(i=>{if(e===null)return i.removeAttribute(t);i.setAttribute(t,e)})}function _(n,r){let t=new Date().getTime();for(;new Date().getTime()-t<r;);}function R(n,r,...t){window[r](...t)}function N(n,r){n.state=r,n.fsm.states[r].entry&&n.dispatch("entry")}var f=class extends HTMLElement{constructor(){super();this.state="";this.fsm={initialState:"",listeners:[],states:{}};this.subs=[];this.timeouts={};this.tranformers={};this.unsub=t=>{this.subs=this.subs.filter(e=>e!==t)};this.dispatch=this.dispatch.bind(this),this.init=this.init.bind(this),this.sub=this.sub.bind(this),this.transform=this.transform.bind(this),this.addTransformer("addClass",p),this.addTransformer("addEventListener",v),this.addTransformer("append",b),this.addTransformer("dispatch",L),this.addTransformer("innerHTML",S),this.addTransformer("history",y),this.addTransformer("get",E),this.addTransformer("location",D),this.addTransformer("post",w),this.addTransformer("removeAttribute",M),this.addTransformer("removeClass",q),this.addTransformer("removeEventListener",A),this.addTransformer("replace",H),this.addTransformer("setAttribute",C),this.addTransformer("state",N),this.addTransformer("textContent",x),this.addTransformer("wait",_),this.addTransformer("window",R)}addTransformer(t,e){return this.tranformers[t]=e,this}connectedCallback(){let t=this.getAttribute("src");if(t)return fetch(t).then(s=>s.json().then(this.init));let e=this.getAttribute("obj");if(e)return this.init(window[e])}dispatch(t){let e=this.fsm.states[this.state][t];if(!e)return;let s=this.state;this.transform(e,()=>{this.subs.forEach(i=>i(t,s,this.state))})}init(t){this.fsm=t;let e=this.fsm.listeners??[],s=()=>{for(let o=0;o<e.length;o++){let[c,u,T]=e[o],h=document.querySelectorAll(c);for(let m=0;m<h.length;m++){let d=h[m],l=g=>{g.preventDefault(),g.target===d&&this.dispatch(T)};d.removeEventListener(u,l),d.addEventListener(u,l)}}};new MutationObserver(o=>{o.forEach(c=>{c.type==="childList"&&c.addedNodes&&s()})}).observe(this,{attributes:!0,childList:!0,subtree:!0}),s();let a=t.states[t.initialState];this.state=t.initialState,a.entry&&this.dispatch("entry")}sub(t){return this.subs.push(t),()=>this.unsub(t)}transform(t=[],e){if(!!t){for(let s=0;s<t.length;s++){let i=t[s],[a,...o]=i,c=this.tranformers[a];if(!c)throw new Error(`Unknown transformer: ${a}`);c(this,...o)}e&&e()}}};customElements.define("dom-x",f);})();
//# sourceMappingURL=dom-x.js.map
