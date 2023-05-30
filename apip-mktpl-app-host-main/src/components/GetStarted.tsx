import React,{useEffect} from "react";


declare global {
  interface Window {
      AdButler: any;
      abkw: string;
      plc609180: number;
      plc609016: number
  }
}

export default function GetStarted() {

  useEffect(() => {
    var AdButler: any = window.AdButler || {};
    AdButler.ads = AdButler.ads || [];
    var abkw = window.abkw || '';
    var plc609016 = window.plc609016 || 0;
    var plc609342 = window.plc609016 || 0;
   // var plc609339 = window.plc609339 || 0;
    // AdButler.ads.push({
    //     handler: function(opt: any) {
    //         AdButler.register(185622, 609016, [300, 250], 'customAd1', opt);
    //     },
    //     opt: {
    //         place: plc609016++,
    //         keywords: abkw,
    //         domain: 'servedbyadbutler.com',
    //         click: 'CLICK_MACRO_PLACEHOLDER'
    //     }
    // });


//     AdButler.ads.push({ 
//       handler: function(opt: any) {
//          AdButler.register(185622, 609180, [728, 90], 'customAd2', opt); },
//      opt: { place: 1, keywords: abkw, domain: 'servedbyadbutler.com', click: 'CLICK_MACRO_PLACEHOLDER' } });

// }, [])



AdButler.ads.push({ 
  handler: function(opt: any) {
     AdButler.register(185622, 609342, [728, 500], 'customAd2', opt); },
 opt: { place:plc609342++ , keywords: abkw, domain: 'servedbyadbutler.com', click: 'CLICK_MACRO_PLACEHOLDER' , height: 300  } });

 AdButler.ads.push({ 
  handler: function(opt: any) {
     AdButler.register(185622, 609342, [728, 500], 'customAd1', opt); },
 opt: { place:plc609342++ , keywords: abkw, domain: 'servedbyadbutler.com', click: 'CLICK_MACRO_PLACEHOLDER' , height: 300  } });

}, [])



  return (
    <section className="mt-16 py-14 mx-auto text-center bg-[url('../public/images/get-started.webp')] bg-contain">
       <h2 className="text-3xl font-bold">How to get started</h2>
       <p className="font-medium mt-5 max-w-[28.125rem] mx-auto">
         Resources and guides to help you through every step of the development
         journey.
       </p>
      <div className="flex justify-center">
      <div id="customAd1" style={{width:'200px'}}></div>
      <div id="customAd2" className="customAd2" ></div>
      </div>
      <style>{`
      #customAd2 iframe {
        height: 300px; /* Adjust the height here (e.g., 300 for 300 pixels) */
      }
    `}</style>
    <style>{`
      #customAd1 iframe {
        height: 300px; /* Adjust the height here (e.g., 300 for 300 pixels) */
      }
    `}</style>
      
    </section>
  );
}
