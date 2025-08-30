var ue=Object.defineProperty;var me=(r,e,t)=>e in r?ue(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var w=(r,e,t)=>me(r,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function t(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(s){if(s.ep)return;s.ep=!0;const o=t(s);fetch(s.href,o)}})();/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const j=globalThis,V=j.ShadowRoot&&(j.ShadyCSS===void 0||j.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,W=Symbol(),F=new WeakMap;let oe=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==W)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(V&&e===void 0){const i=t!==void 0&&t.length===1;i&&(e=F.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&F.set(t,e))}return e}toString(){return this.cssText}};const fe=r=>new oe(typeof r=="string"?r:r+"",void 0,W),q=(r,...e)=>{const t=r.length===1?r[0]:e.reduce((i,s,o)=>i+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[o+1],r[0]);return new oe(t,r,W)},$e=(r,e)=>{if(V)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const i=document.createElement("style"),s=j.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=t.cssText,r.appendChild(i)}},J=V?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return fe(t)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:ge,defineProperty:_e,getOwnPropertyDescriptor:ye,getOwnPropertyNames:Ae,getOwnPropertySymbols:be,getPrototypeOf:ve}=Object,$=globalThis,Z=$.trustedTypes,xe=Z?Z.emptyScript:"",R=$.reactiveElementPolyfillSupport,C=(r,e)=>r,D={toAttribute(r,e){switch(e){case Boolean:r=r?xe:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},ne=(r,e)=>!ge(r,e),Q={attribute:!0,type:String,converter:D,reflect:!1,useDefault:!1,hasChanged:ne};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),$.litPropertyMetadata??($.litPropertyMetadata=new WeakMap);let v=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Q){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(e,i,t);s!==void 0&&_e(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){const{get:s,set:o}=ye(this.prototype,e)??{get(){return this[t]},set(n){this[t]=n}};return{get:s,set(n){const h=s==null?void 0:s.call(this);o==null||o.call(this,n),this.requestUpdate(e,h,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Q}static _$Ei(){if(this.hasOwnProperty(C("elementProperties")))return;const e=ve(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(C("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(C("properties"))){const t=this.properties,i=[...Ae(t),...be(t)];for(const s of i)this.createProperty(s,t[s])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[i,s]of t)this.elementProperties.set(i,s)}this._$Eh=new Map;for(const[t,i]of this.elementProperties){const s=this._$Eu(t,i);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const s of i)t.unshift(J(s))}else e!==void 0&&t.push(J(e));return t}static _$Eu(e,t){const i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((t=e.hostConnected)==null||t.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return $e(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(t=>{var i;return(i=t.hostConnected)==null?void 0:i.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var i;return(i=t.hostDisconnected)==null?void 0:i.call(t)})}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){var o;const i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(s!==void 0&&i.reflect===!0){const n=(((o=i.converter)==null?void 0:o.toAttribute)!==void 0?i.converter:D).toAttribute(t,i.type);this._$Em=e,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(e,t){var o,n;const i=this.constructor,s=i._$Eh.get(e);if(s!==void 0&&this._$Em!==s){const h=i.getPropertyOptions(s),a=typeof h.converter=="function"?{fromAttribute:h.converter}:((o=h.converter)==null?void 0:o.fromAttribute)!==void 0?h.converter:D;this._$Em=s;const c=a.fromAttribute(t,h.type);this[s]=c??((n=this._$Ej)==null?void 0:n.get(s))??c,this._$Em=null}}requestUpdate(e,t,i){var s;if(e!==void 0){const o=this.constructor,n=this[e];if(i??(i=o.getPropertyOptions(e)),!((i.hasChanged??ne)(n,t)||i.useDefault&&i.reflect&&n===((s=this._$Ej)==null?void 0:s.get(e))&&!this.hasAttribute(o._$Eu(e,i))))return;this.C(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:o},n){i&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,n??t??this[e]),o!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,n]of this._$Ep)this[o]=n;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[o,n]of s){const{wrapped:h}=n,a=this[o];h!==!0||this._$AL.has(o)||a===void 0||this.C(o,void 0,n,a)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),(i=this._$EO)==null||i.forEach(s=>{var o;return(o=s.hostUpdate)==null?void 0:o.call(s)}),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(i=>{var s;return(s=i.hostUpdated)==null?void 0:s.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}};v.elementStyles=[],v.shadowRootOptions={mode:"open"},v[C("elementProperties")]=new Map,v[C("finalized")]=new Map,R==null||R({ReactiveElement:v}),($.reactiveElementVersions??($.reactiveElementVersions=[])).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const P=globalThis,z=P.trustedTypes,X=z?z.createPolicy("lit-html",{createHTML:r=>r}):void 0,ae="$lit$",f=`lit$${Math.random().toFixed(9).slice(2)}$`,he="?"+f,Ee=`<${he}>`,b=document,O=()=>b.createComment(""),U=r=>r===null||typeof r!="object"&&typeof r!="function",G=Array.isArray,we=r=>G(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",k=`[ 	
\f\r]`,S=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Y=/-->/g,ee=/>/g,g=RegExp(`>|${k}(?:([^\\s"'>=/]+)(${k}*=${k}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),te=/'/g,se=/"/g,le=/^(?:script|style|textarea|title)$/i,Se=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),K=Se(1),x=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),ie=new WeakMap,_=b.createTreeWalker(b,129);function ce(r,e){if(!G(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return X!==void 0?X.createHTML(e):e}const Ce=(r,e)=>{const t=r.length-1,i=[];let s,o=e===2?"<svg>":e===3?"<math>":"",n=S;for(let h=0;h<t;h++){const a=r[h];let c,p,l=-1,u=0;for(;u<a.length&&(n.lastIndex=u,p=n.exec(a),p!==null);)u=n.lastIndex,n===S?p[1]==="!--"?n=Y:p[1]!==void 0?n=ee:p[2]!==void 0?(le.test(p[2])&&(s=RegExp("</"+p[2],"g")),n=g):p[3]!==void 0&&(n=g):n===g?p[0]===">"?(n=s??S,l=-1):p[1]===void 0?l=-2:(l=n.lastIndex-p[2].length,c=p[1],n=p[3]===void 0?g:p[3]==='"'?se:te):n===se||n===te?n=g:n===Y||n===ee?n=S:(n=g,s=void 0);const m=n===g&&r[h+1].startsWith("/>")?" ":"";o+=n===S?a+Ee:l>=0?(i.push(c),a.slice(0,l)+ae+a.slice(l)+f+m):a+f+(l===-2?h:m)}return[ce(r,o+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]};class H{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let o=0,n=0;const h=e.length-1,a=this.parts,[c,p]=Ce(e,t);if(this.el=H.createElement(c,i),_.currentNode=this.el.content,t===2||t===3){const l=this.el.content.firstChild;l.replaceWith(...l.childNodes)}for(;(s=_.nextNode())!==null&&a.length<h;){if(s.nodeType===1){if(s.hasAttributes())for(const l of s.getAttributeNames())if(l.endsWith(ae)){const u=p[n++],m=s.getAttribute(l).split(f),N=/([.?@])?(.*)/.exec(u);a.push({type:1,index:o,name:N[2],strings:m,ctor:N[1]==="."?Oe:N[1]==="?"?Ue:N[1]==="@"?He:T}),s.removeAttribute(l)}else l.startsWith(f)&&(a.push({type:6,index:o}),s.removeAttribute(l));if(le.test(s.tagName)){const l=s.textContent.split(f),u=l.length-1;if(u>0){s.textContent=z?z.emptyScript:"";for(let m=0;m<u;m++)s.append(l[m],O()),_.nextNode(),a.push({type:2,index:++o});s.append(l[u],O())}}}else if(s.nodeType===8)if(s.data===he)a.push({type:2,index:o});else{let l=-1;for(;(l=s.data.indexOf(f,l+1))!==-1;)a.push({type:7,index:o}),l+=f.length-1}o++}}static createElement(e,t){const i=b.createElement("template");return i.innerHTML=e,i}}function E(r,e,t=r,i){var n,h;if(e===x)return e;let s=i!==void 0?(n=t._$Co)==null?void 0:n[i]:t._$Cl;const o=U(e)?void 0:e._$litDirective$;return(s==null?void 0:s.constructor)!==o&&((h=s==null?void 0:s._$AO)==null||h.call(s,!1),o===void 0?s=void 0:(s=new o(r),s._$AT(r,t,i)),i!==void 0?(t._$Co??(t._$Co=[]))[i]=s:t._$Cl=s),s!==void 0&&(e=E(r,s._$AS(r,e.values),s,i)),e}class Pe{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,s=((e==null?void 0:e.creationScope)??b).importNode(t,!0);_.currentNode=s;let o=_.nextNode(),n=0,h=0,a=i[0];for(;a!==void 0;){if(n===a.index){let c;a.type===2?c=new M(o,o.nextSibling,this,e):a.type===1?c=new a.ctor(o,a.name,a.strings,this,e):a.type===6&&(c=new Me(o,this,e)),this._$AV.push(c),a=i[++h]}n!==(a==null?void 0:a.index)&&(o=_.nextNode(),n++)}return _.currentNode=b,s}p(e){let t=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class M{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=E(this,e,t),U(e)?e===d||e==null||e===""?(this._$AH!==d&&this._$AR(),this._$AH=d):e!==this._$AH&&e!==x&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):we(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==d&&U(this._$AH)?this._$AA.nextSibling.data=e:this.T(b.createTextNode(e)),this._$AH=e}$(e){var o;const{values:t,_$litType$:i}=e,s=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=H.createElement(ce(i.h,i.h[0]),this.options)),i);if(((o=this._$AH)==null?void 0:o._$AD)===s)this._$AH.p(t);else{const n=new Pe(s,this),h=n.u(this.options);n.p(t),this.T(h),this._$AH=n}}_$AC(e){let t=ie.get(e.strings);return t===void 0&&ie.set(e.strings,t=new H(e)),t}k(e){G(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,s=0;for(const o of e)s===t.length?t.push(i=new M(this.O(O()),this.O(O()),this,this.options)):i=t[s],i._$AI(o),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,t);e!==this._$AB;){const s=e.nextSibling;e.remove(),e=s}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}}class T{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,o){this.type=1,this._$AH=d,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=o,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=d}_$AI(e,t=this,i,s){const o=this.strings;let n=!1;if(o===void 0)e=E(this,e,t,0),n=!U(e)||e!==this._$AH&&e!==x,n&&(this._$AH=e);else{const h=e;let a,c;for(e=o[0],a=0;a<o.length-1;a++)c=E(this,h[i+a],t,a),c===x&&(c=this._$AH[a]),n||(n=!U(c)||c!==this._$AH[a]),c===d?e=d:e!==d&&(e+=(c??"")+o[a+1]),this._$AH[a]=c}n&&!s&&this.j(e)}j(e){e===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class Oe extends T{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===d?void 0:e}}class Ue extends T{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==d)}}class He extends T{constructor(e,t,i,s,o){super(e,t,i,s,o),this.type=5}_$AI(e,t=this){if((e=E(this,e,t,0)??d)===x)return;const i=this._$AH,s=e===d&&i!==d||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,o=e!==d&&(i===d||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t;typeof this._$AH=="function"?this._$AH.call(((t=this.options)==null?void 0:t.host)??this.element,e):this._$AH.handleEvent(e)}}class Me{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){E(this,e)}}const L=P.litHtmlPolyfillSupport;L==null||L(H,M),(P.litHtmlVersions??(P.litHtmlVersions=[])).push("3.3.1");const Ne=(r,e,t)=>{const i=(t==null?void 0:t.renderBefore)??e;let s=i._$litPart$;if(s===void 0){const o=(t==null?void 0:t.renderBefore)??null;i._$litPart$=s=new M(e.insertBefore(O(),o),o,void 0,t??{})}return s._$AI(r),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const y=globalThis;class A extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ne(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return x}}var re;A._$litElement$=!0,A.finalized=!0,(re=y.litElementHydrateSupport)==null||re.call(y,{LitElement:A});const B=y.litElementPolyfillSupport;B==null||B({LitElement:A});(y.litElementVersions??(y.litElementVersions=[])).push("4.2.1");class de extends A{render(){return K`
      <header>
        <div class="emoji">🧁</div>
        <h1>GBBO Bracket 2025</h1>
      </header>
    `}}w(de,"styles",q`
    :host {
      display: block;
      width: 100%;
    }
    
    header {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      text-align: center;
      margin-bottom: 3rem;
      padding: 2rem;
      background-color: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(4px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 1.5rem;
      box-shadow: 0 25px 50px -12px rgba(139, 69, 19, 0.1);
    }
    
    .emoji {
      font-size: 6rem;
      margin-bottom: 1rem;
    }
    
    @media (max-width: 768px) {
      .emoji {
        font-size: 5rem;
      }
      
      header {
        padding: 1.5rem;
      }
    }
    
    @media (max-width: 640px) {
      .emoji {
        font-size: 4rem;
      }
      
      header {
        padding: 1rem;
      }
    }
    
    h1 {
      font-family: 'Playfair Display', serif;
      font-size: 5rem;
      font-weight: 700;
      color: #8b4513;
      margin-top: 0;
      margin-bottom: 0.5rem;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
    
    @media (max-width: 768px) {
      h1 {
        font-size: 4rem;
      }
    }
    
    @media (max-width: 640px) {
      h1 {
        font-size: 3rem;
      }
    }
  `);customElements.define("gbbo-header",de);class I extends A{constructor(){super(),this.currentSeason="2025",this.isSeasonActive=!0,this.contestantCount=12}render(){return K`
      <div class="welcome-card">
        <h2>Welcome to the Bake Off!</h2>
        <p>Get ready for another delicious season of baking brilliance, soggy bottoms, and Paul Hollywood's handshake.</p>
        
        <div class="season-info">
          <h3>Season ${this.currentSeason}</h3>
          <p>${this.isSeasonActive?"Currently Active":"Coming Soon"} • ${this.contestantCount} Contestants</p>
        </div>
        
        <div class="emoji-container">
          <span class="emoji">🥖</span>
          <span class="emoji">🍰</span>
          <span class="emoji">🥧</span>
          <span class="emoji">🍪</span>
        </div>
      </div>
    `}}w(I,"properties",{currentSeason:{type:String},isSeasonActive:{type:Boolean},contestantCount:{type:Number}}),w(I,"styles",q`
    :host {
      display: block;
      width: 100%;
    }
    
    .welcome-card {
      background-color: rgba(255, 255, 255, 0.9);
      padding: 3rem;
      border-radius: 1.5rem;
      text-align: center;
      max-width: 42rem;
      width: 100%;
      box-shadow: 0 25px 50px -12px rgba(139, 69, 19, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    @media (max-width: 768px) {
      .welcome-card {
        padding: 2rem;
      }
    }
    
    @media (max-width: 640px) {
      .welcome-card {
        padding: 1.5rem;
      }
    }
    
    h2 {
      font-family: 'Playfair Display', serif;
      font-size: 2.5rem;
      color: #8b4513;
      margin-top: 0;
      margin-bottom: 1.5rem;
    }
    
    @media (max-width: 768px) {
      h2 {
        font-size: 1.875rem;
      }
    }
    
    @media (max-width: 640px) {
      h2 {
        font-size: 1.5rem;
      }
    }
    
    p {
      font-size: 1.25rem;
      color: #374151;
      margin-bottom: 2rem;
      line-height: 1.625;
    }
    
    @media (max-width: 768px) {
      p {
        font-size: 1.125rem;
      }
    }
    
    @media (max-width: 640px) {
      p {
        font-size: 1rem;
      }
    }
    
    .season-info {
      background-color: rgba(139, 69, 19, 0.1);
      padding: 1rem;
      border-radius: 0.75rem;
      margin-bottom: 2rem;
      border: 1px solid rgba(139, 69, 19, 0.2);
    }
    
    .season-info h3 {
      font-size: 1.25rem;
      color: #8b4513;
      margin-top: 0;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }
    
    .season-info p {
      font-size: 1rem;
      color: #6b7280;
      margin-bottom: 0;
    }
    
    .emoji-container {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin-top: 2rem;
    }
    
    @media (max-width: 768px) {
      .emoji-container {
        gap: 1rem;
      }
    }
    
    @media (max-width: 640px) {
      .emoji-container {
        gap: 0.75rem;
      }
    }
    
    .emoji {
      font-size: 1.875rem;
      animation: bounce 3s infinite;
    }
    
    @media (max-width: 768px) {
      .emoji {
        font-size: 1.5rem;
      }
    }
    
    @media (max-width: 640px) {
      .emoji {
        font-size: 1.25rem;
      }
    }
    
    .emoji:nth-child(1) {
      animation-delay: 0s;
    }
    
    .emoji:nth-child(2) {
      animation-delay: 0.25s;
    }
    
    .emoji:nth-child(3) {
      animation-delay: .5s;
    }
    
    .emoji:nth-child(4) {
      animation-delay: 1s;
    }
    
    @keyframes bounce {
      0%, 100% {
        transform: translate3d(0, 0, 0);
      }
      25% {
        transform: translate3d(0, -15px, 0);
      }
      50% {
        transform: translate3d(0, -8px, 0);
      }
      75% {
        transform: translate3d(0, -4px, 0);
      }
    }
  `);customElements.define("gbbo-welcome-card",I);class pe extends A{render(){return K`
      <footer>
        <p>Brought to you with love and a pinch of salt</p>
      </footer>
    `}}w(pe,"styles",q`
    :host {
      display: block;
      width: 100%;
    }
    
    footer {
      text-align: center;
      margin-top: 3rem;
      padding: 1.5rem;
      color: #1e40af;
      font-style: italic;
      font-weight: 300;
    }
    
    p {
      font-size: 1.125rem;
    }
    
    @media (max-width: 640px) {
      p {
        font-size: 1rem;
      }
    }
  `);customElements.define("gbbo-footer",pe);class je{constructor(){this.init()}init(){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>this.setup()):this.setup()}setup(){console.log("🧁 GBBO Bracket 2025 - Ready to bake with LitElement!"),this.addEventListeners()}addEventListeners(){document.addEventListener("click",e=>{})}}new je;
