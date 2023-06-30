import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';

class AdButlerAd extends StatelessWidget {
  final String adButlerCode = '''
    <!-- zone1 [async] -->
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
      html, body {
        margin: 0;
        padding: 0;
        overflow: hidden;
      }
       iframe {
        height: 100%;
      }
    </style>
    <script type="text/javascript">if (!window.AdButler){(function(){var s = document.createElement("script"); s.async = true; s.type = "text/javascript";s.src = 'https://servedbyadbutler.com/app.js';var n = document.getElementsByTagName("script")[0]; n.parentNode.insertBefore(s, n);}());}</script>
    <script type="text/javascript">
    var AdButler = AdButler || {}; AdButler.ads = AdButler.ads || [];
    var abkw = window.abkw || '';
    var plc614266 = window.plc614266 || 0;
    document.write('<'+'div id="placement_614266_'+plc614266+'"></'+'div>');
    AdButler.ads.push({handler: function(opt){ AdButler.register(185790, 614266, [300,250], 'placement_614266_'+opt.place, opt); }, opt: { place: plc614266++, keywords: abkw, domain: 'servedbyadbutler.com', click:'CLICK_MACRO_PLACEHOLDER' }});
    </script>
  ''';

  @override
  Widget build(BuildContext context) {
    return InAppWebView(
      initialData: InAppWebViewInitialData(data: adButlerCode),
    );
  }
}

class AdButlerAd1 extends StatelessWidget {
  final String adButlerCode1 = '''
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
      html, body {
        margin: 0;
        padding: 0;
        overflow: hidden;
      }
    </style>
<script type="text/javascript">if (!window.AdButler){(function(){var s = document.createElement("script"); s.async = true; s.type = "text/javascript";s.src = 'https://servedbyadbutler.com/app.js';var n = document.getElementsByTagName("script")[0]; n.parentNode.insertBefore(s, n);}());}</script>
<script type="text/javascript">
var AdButler = AdButler || {}; AdButler.ads = AdButler.ads || [];
var abkw = window.abkw || '';
var plc618118 = window.plc618118 || 0;
document.write('<'+'div id="placement_618118_'+plc618118+'"></'+'div>');
AdButler.ads.push({handler: function(opt){ AdButler.register(185790, 618118, [320,50], 'placement_618118_'+opt.place, opt); }, opt: { place: plc618118++, keywords: abkw, domain: 'servedbyadbutler.com', click:'CLICK_MACRO_PLACEHOLDER' }});
</script>
''';

  @override
  Widget build(BuildContext context) {
    return InAppWebView(
      initialData: InAppWebViewInitialData(data: adButlerCode1),
    );
  }
}

class AdButlerAd2 extends StatelessWidget {
  final String adButlerCode2 = ''' 
 <!-- nativeadzone [async] -->
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <style>
      html, body {
        margin: 0;
        padding: 0;
        overflow: hidden;
      }
      iframe {
        height: 100%;
      }
    </style>
<script type="text/javascript">if (!window.AdButler){(function(){var s = document.createElement("script"); s.async = true; s.type = "text/javascript";s.src = 'https://servedbyadbutler.com/app.js';var n = document.getElementsByTagName("script")[0]; n.parentNode.insertBefore(s, n);}());}</script>
<script type="text/javascript">
var AdButler = AdButler || {}; AdButler.ads = AdButler.ads || [];
var abkw = window.abkw || '';
var plc619019 = window.plc619019 || 0;
document.write('<'+'div id="placement_619019_'+plc619019+'"></'+'div>');
AdButler.ads.push({handler: function(opt){ AdButler.register(185790, 619019, [300,250], 'placement_619019_'+opt.place, opt); }, opt: { place: plc619019++, keywords: abkw, domain: 'servedbyadbutler.com', click:'CLICK_MACRO_PLACEHOLDER' }});
</script>

''';

  @override
  Widget build(BuildContext context) {
    return InAppWebView(
      initialData: InAppWebViewInitialData(data: adButlerCode2),
    );
  }
}

class AdButlar extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AdButler Example',
      home: Scaffold(
        appBar: AppBar(
          title: Text('AdButler Example'),
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('Other widgets'),
              Container(
                width: 300, // Set the desired width of the ad container
                height: 250, // Set the desired height of the ad container
                child: AdButlerAd(),
              ),
              Container(
                width: 300, // Set the desired width of the ad container
                height: 50, // Set the desired height of the ad container
                child: AdButlerAd1(),
              ),
              Container(
                width: 300, // Set the desired width of the ad container
                height: 290, // Set the desired height of the ad container
                child: AdButlerAd2(),
              ),
              Text('Other widgets'),
            ],
          ),
        ),
      ),
    );
  }
}
