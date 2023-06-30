import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:pg_poc/data/provider/qrcode_provider.dart';
import 'package:pg_poc/data/provider/ratings_provider.dart';
import 'package:pg_poc/data/provider/screen_provider.dart';
import 'package:pg_poc/data/provider/url_provider.dart';
import 'package:pg_poc/firebase_options.dart';
import 'package:pg_poc/presentation/screens/ad_butlar.dart';
import 'package:pg_poc/presentation/screens/home_screen.dart';
import 'package:pg_poc/presentation/screens/intro_screen.dart';
import 'package:pg_poc/presentation/screens/qrcode_screen.dart';
import 'package:pg_poc/presentation/screens/rating_screen.dart';
import 'package:pg_poc/presentation/screens/url_screen.dart';
import 'package:provider/provider.dart';
import 'presentation/color_schemes.dart';
import 'package:pg_poc/presentation/screens/ad_screen.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  MobileAds.instance.initialize();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ScreenProvider()),
        ChangeNotifierProvider(create: (_) => RatingsProvider()),
        ChangeNotifierProvider(create: (_) => QRcodeProvider()),
        ChangeNotifierProvider(create: (_) => UrlProvider()),
      ],
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);
  static FirebaseAnalytics analytics = FirebaseAnalytics.instance;
  static FirebaseAnalyticsObserver observer =
      FirebaseAnalyticsObserver(analytics: analytics);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    ThemeData buildTheme({colorScheme}) {
      var baseTheme = ThemeData(useMaterial3: true, colorScheme: colorScheme);
      return baseTheme.copyWith(
        textTheme: GoogleFonts.montserratTextTheme(baseTheme.textTheme),
      );
    }

    return MaterialApp(
      theme: buildTheme(colorScheme: lightColorScheme),
      darkTheme: buildTheme(colorScheme: darkColorScheme),
      navigatorObservers: [observer],
      home: IntroScreen(),
      routes: <String, WidgetBuilder>{
        'home_screen': (BuildContext context) => HomeScreen(),
        'qrcode_screen': (BuildContext context) => QRcodeScreen(),
        'url_screen': (BuildContext context) => URLScreen(),
        'rating_screen': (BuildContext context) => RatingScreen(),
        'intro_screen': (BuildContext context) => IntroScreen(),
        'ad_screen': (BuildContext context) => AdScreen(),
        'ad_butlar': (BuildContext context) => AdButlar()
      },
    );
  }
}
