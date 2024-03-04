"use strict";(()=>{var c=class extends HTMLElement{constructor(){super();this.state="";this.config={actions:{},initialState:"",listeners:[],states:{}};this.subs=[];this.timeouts={};this.handleEvent=this.handleEvent.bind(this),this.applyAction=this.applyAction.bind(this),this.applyAppend=this.applyAppend.bind(this),this.applyAttr=this.applyAttr.bind(this),this.applyCall=this.applyCall.bind(this),this.applyEventListener=this.applyEventListener.bind(this),this.applyDispatch=this.applyDispatch.bind(this),this.applyGet=this.applyGet.bind(this),this.applyHistory=this.applyHistory.bind(this),this.applyWin=this.applyWin.bind(this),this.applyPost=this.applyPost.bind(this),this.applyReplace=this.applyReplace.bind(this),this.applyState=this.applyState.bind(this),this.applyText=this.applyText.bind(this),this.applyWait=this.applyWait.bind(this),this.dispatch=this.dispatch.bind(this),this.handleClientEvent=this.handleClientEvent.bind(this),this.handleServerEvent=this.handleServerEvent.bind(this),this.init=this.init.bind(this),this.sub=this.sub.bind(this),this.transform=this.transform.bind(this)}applyAction(t){let[,e]=t;this.config.actions[e].forEach(s=>this.handleEvent(e,s))}applyAppend(t){let[,e,s]=t,i=this.querySelector(e);if(!i)return;let n=document.createElement("template");n.innerHTML=decodeURIComponent(s),i.append(n.content)}applyAttr(t){let[,e,s,i]=t;this.querySelectorAll(e).forEach(a=>{if(i===null)return a.removeAttribute(s);a.setAttribute(s,i)})}applyCall(t){let[,e,s,...i]=t,n=this.querySelector(e);!n||n[s](...i)}applyEventListener(t){let[e,s,i]=t,n=this.querySelectorAll(s);for(let a=0;a<n.length;a++){let r=n[a],l=h=>{h.preventDefault(),this.handleClientEvent(i)};r.removeEventListener(e,l),r.addEventListener(e,l)}}applyDispatch(t){let[,e,s=0]=t;clearTimeout(this.timeouts[e]),this.timeouts[e]=setTimeout(()=>this.handleClientEvent(e),s)}applyGet(t){let[,e]=t;fetch(e,{method:"GET"}).then(s=>s.json().then(i=>this.handleEvent("entry",i)))}applyHistory(t){let[,e,...s]=t;history[e](...s)}applyWin(t){let[,e,...s]=t;window[e](...s)}applyPost(t){let[,e,...s]=t,i={};for(let n=0;n<s.length;n++){let[a,r,l]=s[n],h=this.querySelector(r);if(!h)return;i[a]=h[l]}fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)}).then(n=>n.json().then(a=>this.handleEvent("entry",a)))}applyReplace(t){let[,e,s]=t,i=this.querySelector(e);!i||(i.innerHTML="",i.innerHTML=decodeURIComponent(s))}applyState(t){let[,e]=t;this.config.states[e].entry&&this.handleEvent("entry",...this.config.states[e].entry),this.state=e}applyText(t){let[,e,s]=t;this.querySelectorAll(e).forEach(n=>n.textContent=s)}applyWait(t){let[,e,s]=t,i=new Date().getTime();for(;new Date().getTime()-i<e;);s&&this.handleClientEvent(s)}connectedCallback(){let t=this.getAttribute("src");if(t)return fetch(t).then(s=>s.json().then(this.init));let e=this.getAttribute("obj");if(e)return this.init(window[e])}dispatch(t){this.handleClientEvent(t)}handleClientEvent(t){this.handleEvent(t,...this.config.states[this.state][t])}handleServerEvent(t){let{evt:e}=t,s=this.config.states[this.state][e].reduce((i,n)=>[...i,n],[]);this.handleEvent(e,...s)}handleEvent(t,...e){if(!!e)for(let s=0;s<e.length;s++){let i=e[s],[n]=i;({action:this.applyAction,append:this.applyAppend,attr:this.applyAttr,call:this.applyCall,click:this.applyEventListener,dispatch:this.applyDispatch,get:this.applyGet,history:this.applyHistory,post:this.applyPost,replace:this.applyReplace,state:this.applyState,submit:this.applyEventListener,text:this.applyText,wait:this.applyWait,win:this.applyWin})[n](i),this.subs.forEach(r=>r(this.state,t,i))}}init(t){this.config=t;let e=this.config.listeners??[],s=()=>{for(let a=0;a<e.length;a++){let[r,l,h]=e[a],v=`${r}:not([data-dx-state="registered"])`,y=this.querySelectorAll(v);for(let o=0;o<y.length;o++){let p=y[o],D=g=>{g.preventDefault(),g.target===p&&this.handleClientEvent(h)};p.addEventListener(l,D),p.dataset.dxState="registered"}}};new MutationObserver(a=>{a.forEach(r=>{r.type==="childList"&&r.addedNodes&&s()})}).observe(this,{attributes:!0,childList:!0,subtree:!0}),s();let n=t.states[t.initialState];this.state=t.initialState,n.entry&&this.handleEvent("entry",...n.entry)}sub(t){this.subs.push(t)}transform(t,...e){this.handleEvent(t,...e)}};customElements.define("dx-state",c);var d=class extends HTMLElement{constructor(){super();this.state="";this.is="";this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML="<slot></slot>"}connectedCallback(){let t=this.getAttribute("state"),e=this.getAttribute("is");!t||!e||document.querySelector(`dx-state[name="${t}"]`).sub(s=>{this.style.display=s===e?"inherit":"none"})}};customElements.define("dx-state-if",d);})();
//# sourceMappingURL=dx-state.js.map
