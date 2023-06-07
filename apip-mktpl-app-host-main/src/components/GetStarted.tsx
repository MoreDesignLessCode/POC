import React,{useEffect} from "react";


declare global {
  interface Window {
      AdButler: any;
      abkw: string;
      plc610168:number
      plc610177:number
  }
}

export default function GetStarted() {

  useEffect(() => {
    var AdButler: any = window.AdButler || {};
    AdButler.ads = AdButler.ads || [];
    var abkw = window.abkw || '';
    var plc610168 = window.plc610168 || 0;
    var plc610177 = window.plc610177 || 0
  
AdButler.ads.push({
  handler: function(opt:any){
  AdButler.register(185706, 610168, [300,250], 'customAd1', opt); }, 
  opt: { place: plc610168++, keywords: abkw, domain: 'servedbyadbutler.com', click:'CLICK_MACRO_PLACEHOLDER' }});
  
  AdButler.ads.push({
    handler: function(opt:any){ 
    AdButler.register(185706, 610177, [300,250], 'filmstripad',opt); }, 
    opt: { place: plc610177++, keywords: abkw, domain: 'servedbyadbutler.com', click:'CLICK_MACRO_PLACEHOLDER' }});

}, [])



  return (
    <section className="mt-16 py-14 mx-auto text-center bg-[url('../public/images/get-started.webp')] bg-contain">
       <h2 className="text-3xl font-bold">How to get started</h2>
       <p className="font-medium mt-5 max-w-[28.125rem] mx-auto">
         Resources and guides to help you through every step of the development
         journey.
       </p>
      <div className="flex justify-center" style={{gap:'30px'}}>
      <div id="customAd1" style={{marginTop:'20px',width:'200px'}}></div>
      <div id="filmstripad" style={{marginTop:'20px'}} className="customAd2" ></div>
      </div>
      <style>{`
      #customAd2 iframe {
        height: 400px; /* Adjust the height here (e.g., 300 for 300 pixels) */
      }
    `}</style>
    <style>{`
      #customAd1 iframe {
        height: 324px; /* Adjust the height here (e.g., 300 for 300 pixels) */
      }
    `}</style>
      
    </section>
  );
}
