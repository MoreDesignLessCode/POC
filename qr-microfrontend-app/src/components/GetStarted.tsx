import React,{useEffect} from "react";


declare global {
  interface Window {
      AdButler: any;
      abkw: string;
      plc609742:number;
      plc609744:number
      plc609761:number
      plc609777:number
      plc609782:number
  }
}

export default function GetStarted() {
   
    useEffect(() => {
        var AdButler: any = window.AdButler || {};
        AdButler.ads = AdButler.ads || [];
        var abkw = window.abkw || '';
        var plc609742 = window.plc609742 || 0;
        var plc609744 = window. plc609744 || 0
        var plc609761 = window.plc609761 || 0
        var plc609777 = window.plc609777 || 0
        var plc609782 = window.plc609782 || 0
      
        AdButler.ads.push({
        handler: function(opt:any){ 
        AdButler.register(185622, 609742, [728,90], 'customAd1', opt); }, 
        opt: { place: plc609742++, keywords: abkw, domain: 'servedbyadbutler.com', click:'CLICK_MACRO_PLACEHOLDER' }});

        AdButler.ads.push({
        handler: function(opt:any){ 
        AdButler.register(185622, 609744, [300,250], 'customAd2', opt); },
        opt: { place: plc609744++, keywords: abkw, domain: 'servedbyadbutler.com', click:'CLICK_MACRO_PLACEHOLDER' }});

        AdButler.ads.push({
        handler: function(opt:any){
        AdButler.register(185622, 609761, [300,250], 'nativeAd', opt); }, 
        opt: { place: plc609761++, keywords: abkw, domain: 'servedbyadbutler.com', click:'CLICK_MACRO_PLACEHOLDER' }});

        AdButler.ads.push({
        handler: function(opt:any){ 
        AdButler.register(185622, 609777, [300,250], 'slideAd', opt); }, 
        opt: { place: plc609777++, keywords: abkw, domain: 'servedbyadbutler.com', click:'CLICK_MACRO_PLACEHOLDER' }});
    
        AdButler.ads.push({
        handler: function(opt:any){ 
        AdButler.register(185622, 609782, [300,250], 'banderole-ad', opt); },
        opt: { place: plc609782++, keywords: abkw, domain: 'servedbyadbutler.com', click:'CLICK_MACRO_PLACEHOLDER' }});

    }, [])
    
 
  return (
    <>
      <center>
        <h1>Leaderboard-Image banner</h1>
        <div id="customAd1"></div>
      </center>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
        <div>
          <h3>medium image banner</h3>
          <div id="customAd2"></div>
        </div>
        <div>
          <h3>sliding ad</h3>
          <div id="slideAd">
          </div>
        </div>
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

      <div style={{ marginTop: '20px' }}>
        <h2>Custom Native Ad</h2>
        <div id="nativeAd"></div>
      </div>
    
    </>
  );
}

