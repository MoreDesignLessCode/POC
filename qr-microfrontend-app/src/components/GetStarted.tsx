import React,{useEffect} from "react";


declare global {
  interface Window {
      AdButler: any;
      abkw: string;
      plc610167:number
      plc610168:number
      plc610169:number
      plc610172: number
      plc610173: number
      plc610177:number
  }
}

export default function GetStarted() {
   
    useEffect(() => {
        var AdButler: any = window.AdButler || {};
        AdButler.ads = AdButler.ads || [];
        var abkw = window.abkw || '';
        var plc610167= window.plc610167 || 0;
        var plc610168 = window.plc610168 || 0;
        var plc610169 = window.plc610169 || 0;
        var plc610172 = window.plc610172 || 0;
        var plc610177 =window.plc610177 || 0

        AdButler.ads.push({
          handler: function(opt:any){
           AdButler.register(185706, 610167, [300,250], 'customAd2', opt); }, 
           opt: { place: plc610167++, keywords: abkw, domain: 'servedbyadbutler.com',  click:'CLICK_MACRO_PLACEHOLDER' }});
      
        AdButler.ads.push({
        handler: function(opt:any){ 
        AdButler.register(185706, 610169, [728,90], 'customAd1', opt); }, 
        opt: { place: plc610169++, keywords: abkw, domain: 'servedbyadbutler.com', click:'CLICK_MACRO_PLACEHOLDER' }});

        AdButler.ads.push({
        handler: function(opt:any){
        AdButler.register(185706, 610168, [300,250], 'nativeAd', opt); }, 
        opt: { place: plc610168++, keywords: abkw, domain: 'servedbyadbutler.com', click:'CLICK_MACRO_PLACEHOLDER' }});
        
        AdButler.ads.push({
        handler: function(opt:any){ 
        AdButler.register(185706,610172 , [300,250], 'banderole-ad', opt); },
        opt: { place: plc610172++, keywords: abkw, domain: 'servedbyadbutler.com', click:'CLICK_MACRO_PLACEHOLDER' }});
        
        AdButler.ads.push({
        handler: function(opt:any){ 
        AdButler.register(185706, 610177, [300,250], 'filmstripad',opt); }, 
        opt: { place: plc610177++, keywords: abkw, domain: 'servedbyadbutler.com', click:'CLICK_MACRO_PLACEHOLDER' }});
    }, [])
    
 
  return (
    <>
    
      <center>
        <h1>Leaderboard-Image banner</h1>
        <div id="customAd1"></div>
      </center>
      
      <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
        <div>
          <h3>medium image banner</h3>
          <div id="customAd2"></div>
        </div>
        <div>
          <h3>filimstrip ad</h3>
          <div id="filmstripad">
          </div>
      </div>
      <div >
        <h2>Custom Native Ad</h2>
        <div id="nativeAd"></div>
        </div>
        <style>{`
      #nativeAd iframe {
       height:324px
      }
    `}</style>
        <div style={{marginLeft:'auto'}}>
          <h3>banderole ad</h3>
        <div id="banderole-ad" ></div>
        </div>
    <style>{`
      #banderole-ad iframe {
       height:100px
      }
    `}</style>
      </div>

    
    
    </>
  );
}

