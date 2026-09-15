import{n as e,t}from"./rolldown-runtime.Dh6celcD.mjs";import{A as n,O as r,P as i,_ as a,c as o,j as s,o as c,w as l,y as u}from"./react.dDmQWQoP.mjs";import{C as d,a as f,r as p,t as m}from"./motion.C3Iwiz80.mjs";import{A as h,D as g,G as _,H as v,P as y,Tt as b,X as x,_t as S,ct as C,i as w,k as T,o as E,wt as D}from"./framer.B_IIFm8_.mjs";import{I as O,L as k}from"./shared-lib.Bf85KT8Q.mjs";var A=e({__FramerMetadata__:()=>G,default:()=>W});function j(e,...t){let n={};return t?.forEach(t=>t&&Object.assign(n,e[t])),n}var M,N,P,F,I,L,R,z,B,V,H,U,W,G,K=t((()=>{c(),x(),m(),l(),k(),M=v(O),N=_(O),P=[`hsLovB1mn`,`dGJeCPINe`],F=`framer-ytTbr`,I={dGJeCPINe:`framer-v-zp4zqu`,hsLovB1mn:`framer-v-1iq7fso`},L={duration:0,type:`tween`},R=e=>typeof e==`object`&&e&&typeof e.src==`string`?e:typeof e==`string`?{src:e}:void 0,z=({value:e,children:t})=>{let r=n(f),i=e??r.transition,a=s(()=>({...r,transition:i}),[JSON.stringify(i)]);return o(f.Provider,{value:a,children:t})},B={Image:`hsLovB1mn`,Video:`dGJeCPINe`},V=d.create(i),H=({cellsRow:e,height:t,id:n,image:r,video:i,width:a,...o})=>({...o,Cuimim1um:e??o.Cuimim1um??16,variant:B[o.variant]??o.variant??`hsLovB1mn`,vUNPVSzaR:r??o.vUNPVSzaR??{pixelHeight:1e3,pixelWidth:1e3,src:`https://framerusercontent.com/images/22MQIF3epWgNnOHjtamot0mvL0.jpg?width=1000&height=1000`,srcSet:`https://framerusercontent.com/images/22MQIF3epWgNnOHjtamot0mvL0.jpg?scale-down-to=512&width=1000&height=1000 512w,https://framerusercontent.com/images/22MQIF3epWgNnOHjtamot0mvL0.jpg?width=1000&height=1000 1000w`},ybORcgyou:i??o.ybORcgyou??`https://framerusercontent.com/assets/k18yp8YF66jcvHoVabiZmNkHmI.mp4`}),U=(e,t)=>e.layoutDependency?t.join(`-`)+e.layoutDependency:t.join(`-`),W=b(a(function(e,t){let n=r(null),i=t??n,a=u(),{activeLocale:s,setLocale:c}=S();C();let{style:l,className:f,layoutId:m,variant:h,vUNPVSzaR:_,ybORcgyou:v,Cuimim1um:b,...x}=H(e),{baseVariant:T,classNames:E,clearLoadingGesture:k,gestureHandlers:A,gestureVariant:M,isLoading:N,setGestureState:B,setVariant:W,variants:G}=D({cycleOrder:P,defaultVariant:`hsLovB1mn`,ref:i,variant:h,variantClassNames:I}),K=U(e,G),q=y(F);return o(p,{id:m??a,children:o(V,{animate:G,initial:!1,children:o(z,{value:L,children:o(d.div,{...x,...A,className:y(q,`framer-1iq7fso`,f,E),"data-framer-name":`Image`,layoutDependency:K,layoutId:`hsLovB1mn`,ref:i,style:{...l},...j({dGJeCPINe:{"data-framer-name":`Video`}},T,M),children:o(w,{children:o(g,{className:`framer-1dabmf8-container`,"data-code-component-plugin-id":`84d4c1`,isAuthoredByUser:!0,isModuleExternal:!0,layoutDependency:K,layoutId:`Z3TenHrwr-container`,nodeId:`Z3TenHrwr`,rendersWithMotion:!0,scopeId:`GFSuRgwr2`,children:(() => {
    let slug = '';
    if (typeof window !== 'undefined' && window.location) {
      const parts = window.location.pathname.split('/').filter(Boolean);
      slug = parts[parts.length - 1]?.toLowerCase() || '';
    }
    const PROJECT_MEDIA = {
      'maggie': { video: '/assets/projects/maggie.mp4', thumbnail: '/assets/projects/maggie.png' },
      'provogue': { video: '/assets/projects/provogue.mp4', thumbnail: '/assets/projects/provogue.png' },
      'bisleri': { video: '/assets/projects/bisleri.mp4', thumbnail: '/assets/projects/bisleri.png' },
      'nddb': { video: '/assets/projects/nddb.mp4', thumbnail: '/assets/projects/nddb.png' },
      'comet': { video: '/assets/projects/comet.mp4', thumbnail: '/assets/projects/comet.png' },
      'clarion-inn': { video: '/assets/projects/clarion-inn.mp4', thumbnail: '/assets/projects/clarion-inn.png' },
      'laneige': { video: '/assets/projects/laneige.mp4', thumbnail: '/assets/projects/laneige.png' },
      'glenn': { video: '/assets/projects/glenn.mp4', thumbnail: '/assets/projects/glenn.png' }
    };
    const media = PROJECT_MEDIA[slug];
    if (media) {
      return o('div', {
        className: 'custom-video-player-wrapper',
        style: { width: '100%', maxWidth: '100%', position: 'relative', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' },
        children: o('media-controller', {
          defaultstreamtype: 'on-demand',
          style: {
            width: '100%',
            aspectRatio: '16/9',
            maxHeight: '80vh',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backgroundColor: '#000000',
            '--media-primary-color': '#ffffff',
            '--media-secondary-color': '#000000',
            '--media-text-color': '#ffffff',
            '--media-background-color': '#000000',
            '--media-control-hover-background': 'rgba(255, 255, 255, 0.15)',
            '--media-font-family': '"Geist Mono", monospace, sans-serif',
            '--media-range-track-background': 'rgba(255, 255, 255, 0.25)'
          },
          children: [
            o('video', {
              slot: 'media',
              src: media.video,
              poster: media.thumbnail,
              preload: 'auto',
              playsInline: true,
              crossOrigin: '',
              style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' }
            }),
            o('media-control-bar', {
              style: { padding: '8px 12px', gap: '8px', background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' },
              children: [
                o('media-play-button', { style: { padding: '6px' } }),
                o('media-seek-backward-button', { seekoffset: 10, style: { padding: '6px' } }),
                o('media-seek-forward-button', { seekoffset: 10, style: { padding: '6px' } }),
                o('media-time-range', { style: { flex: 1, padding: '6px' } }),
                o('media-time-display', { showDuration: true, style: { padding: '6px', fontSize: '13px' } }),
                o('media-mute-button', { style: { padding: '6px' } }),
                o('media-volume-range', { style: { padding: '6px', maxWidth: '80px' } })
              ]
            })
          ]
        })
      });
    }
    return o(O,{appearOnce:!1,appearThreshold:.1,cellsPerRow:b,fillColor:`var(--token-280bd9a0-bf37-41b4-a3c3-9a122b679a65, rgb(255, 255, 255))`,height:`100%`,id:`Z3TenHrwr`,image:R(_),layoutId:`Z3TenHrwr`,mediaType:`image`,pixelReveal:!0,resetOnExit:!1,revealDuration:.8,reverse:!1,style:{width:`100%`},transitionLength:1,videoFile:v,width:`100%`,...j({dGJeCPINe:{mediaType:`video`}},T,M)});
  })()})})})})})})}),[`@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }`,`.framer-ytTbr.framer-1n718ec, .framer-ytTbr .framer-1n718ec { display: block; }`,`.framer-ytTbr.framer-1iq7fso { align-content: center; align-items: center; display: flex; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: center; overflow: var(--overflow-clip-fallback, clip); padding: 0px; position: relative; width: 300px; }`,`.framer-ytTbr .framer-1dabmf8-container { flex: 1 0 0px; height: auto; position: relative; width: 1px; z-index: 1; }`],`framer-ytTbr`),W.displayName=`CMS Media Component`,W.defaultProps={height:300,width:300},h(W,{variant:{options:[`hsLovB1mn`,`dGJeCPINe`],optionTitles:[`Image`,`Video`],title:`Variant`,type:E.Enum},vUNPVSzaR:{__defaultAssetReference:`data:framer/asset-reference,22MQIF3epWgNnOHjtamot0mvL0.jpg?originalFilename=image_placeholder.jpg&width=1000&height=1000`,title:`Image`,type:E.ResponsiveImage},ybORcgyou:N?.videoFile&&{...N.videoFile,__defaultAssetReference:`data:framer/asset-reference,k18yp8YF66jcvHoVabiZmNkHmI.mp4?originalFilename=video_placeholder.mp4`,description:void 0,hidden:void 0,title:`Video`},onybORcgyouChange:{changes:`ybORcgyou`,type:E.ChangeHandler},Cuimim1um:{defaultValue:16,max:40,min:1,step:1,title:`Cells Row`,type:E.Number},onCuimim1umChange:{changes:`Cuimim1um`,type:E.ChangeHandler}}),T(W,[{explicitInter:!0,fonts:[]},...M],{supportsExplicitInterCodegen:!0}),G={exports:{Props:{type:`tsType`,annotations:{framerContractVersion:`1`}},default:{type:`reactComponent`,name:`FramerGFSuRgwr2`,slots:[],annotations:{framerContractVersion:`1`,framerImmutableVariables:`true`,framerIntrinsicWidth:`300`,framerVariables:`{"vUNPVSzaR":"image","ybORcgyou":"video","Cuimim1um":"cellsRow"}`,framerIntrinsicHeight:`300`,framerColorSyntax:`true`,framerComponentViewportWidth:`true`,framerCanvasComponentVariantDetails:`{"propertyName":"variant","data":{"default":{"layout":["fixed","auto"]},"dGJeCPINe":{"layout":["fixed","auto"]}}}`,framerDisplayContentsDiv:`false`,framerAutoSizeImages:`true`}},__FramerMetadata__:{type:`variable`}}}}));export{A as n,K as r,W as t};
//# sourceMappingURL=GFSuRgwr2.b3UOYpMh.mjs.map