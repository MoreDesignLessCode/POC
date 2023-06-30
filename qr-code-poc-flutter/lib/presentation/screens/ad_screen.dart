import 'package:flutter/material.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';

class AdScreen extends StatefulWidget {
  const AdScreen({super.key});

  @override
  State<AdScreen> createState() => _AdScreenState();
}

class _AdScreenState extends State<AdScreen> {
  int _counter = 0;
  late final InterstitialAd interstitialAd;
  late final RewardedAd rewardedAd;
  late final BannerAd bannerAd;
  final String rewardedAdUnitId = 'ca-app-pub-3940256099942544/5224354917';
  final String interStatialAdUnitId = 'ca-app-pub-3940256099942544/1033173712';
  final String bannerAdUnitId = 'ca-app-pub-3940256099942544/6300978111';
  // final String bannerAdUnitId = 'ca-app-pub-9602296488153146/7581235567';
  // final String rewardedAdUnitId = 'ca-app-pub-9602296488153146/2628345681';
  // final String interStatialAdUnitId = 'ca-app-pub-9602296488153146/9325615979';

  @override
  void initState() {
    super.initState();
    _loadInterstatialAd();
    _loadRewardedAd();

    bannerAd = BannerAd(
        size: AdSize.mediumRectangle,
        adUnitId: bannerAdUnitId,
        listener: bannerAdListener,
        request: const AdRequest());

    bannerAd.load();
  }

  final BannerAdListener bannerAdListener = BannerAdListener(
      onAdLoaded: (ad) => print('ad loaded'),
      onAdFailedToLoad: (ad, error) {
        ad.dispose();
        print('$error');
      },
      onAdOpened: (ad) => print('ad opened'),
      onAdClosed: (ad) => print('ad Closed'));

  void _loadInterstatialAd() {
    InterstitialAd.load(
        adUnitId: interStatialAdUnitId,
        request: const AdRequest(),
        adLoadCallback: InterstitialAdLoadCallback(
          onAdLoaded: (ad) {
            print("loaded");
            interstitialAd = ad;
            _setInterstatialContentCallback();
          },
          onAdFailedToLoad: (error) => print(error),
        ));
  }

  void _loadRewardedAd() {
    RewardedAd.load(
        adUnitId: rewardedAdUnitId,
        request: const AdRequest(),
        rewardedAdLoadCallback: RewardedAdLoadCallback(
          onAdLoaded: (ad) {
            print("loaded");
            rewardedAd = ad;
            _setFullScreenContentCallback();
          },
          onAdFailedToLoad: (error) => print(error),
        ));
  }

  void _setInterstatialContentCallback() {
    if (interstitialAd == null) return;
    interstitialAd.fullScreenContentCallback = FullScreenContentCallback(
      //when ad  shows fullscreen
      onAdShowedFullScreenContent: (InterstitialAd ad) =>
          print("$ad onAdShowedFullScreenContent"),
      //when ad dismissed by user
      onAdDismissedFullScreenContent: (InterstitialAd ad) {
        print("$ad onAdDismissedFullScreenContent");

        //dispose the dismissed ad
        ad.dispose();
      },
      //when ad fails to show
      onAdFailedToShowFullScreenContent: (InterstitialAd ad, AdError error) {
        print("$ad  onAdFailedToShowFullScreenContent: $error ");
        //dispose the failed ad
        ad.dispose();
      },

      //when impression is detected
      onAdImpression: (InterstitialAd ad) => print("$ad Impression occured"),
    );
  }

  void _setFullScreenContentCallback() {
    if (rewardedAd == null) return;
    rewardedAd.fullScreenContentCallback = FullScreenContentCallback(
      //when ad  shows fullscreen
      onAdShowedFullScreenContent: (RewardedAd ad) =>
          print("$ad onAdShowedFullScreenContent"),
      //when ad dismissed by user
      onAdDismissedFullScreenContent: (RewardedAd ad) {
        print("$ad onAdDismissedFullScreenContent");

        //dispose the dismissed ad
        // ad.dispose();
      },
      //when ad fails to show
      onAdFailedToShowFullScreenContent: (RewardedAd ad, AdError error) {
        print("$ad  onAdFailedToShowFullScreenContent: $error ");
        //dispose the failed ad
        ad.dispose();
      },

      //when impression is detected
      onAdImpression: (RewardedAd ad) => print("$ad Impression occured"),
    );
  }

  void _showRewardedAds() {
    //this method take a on user earned reward call back
    rewardedAd.show(
        //user earned a reward
        onUserEarnedReward: (AdWithoutView ad, RewardItem rewardItem) {
      //reward user for watching your ad
      num amount = rewardItem.amount;
      print("You earned: $amount");
    });
  }

  int _interstitialCounter = 0;

  void _showInterstatialAd() {
    //this method take a on user earned reward call back
    interstitialAd.show();
  }

  final Map<String, Color> colors = {
    'purple': Colors.purple,
    'blue': Colors.blue,
    'yellow': Colors.yellow,
    'pink': Colors.pink,
    'teal': Colors.teal,
    'orange': Colors.orange
  };

  Color? selectedColor;

  void _incrementCounter() {
    setState(() {
      // This call to setState tells the Flutter framework that something has
      // changed in this State, which causes it to rerun the build method below
      // so that the display can reflect the updated values. If we changed
      // _counter without calling setState(), then the build method would not be
      // called again, and so nothing would appear to happen.
      _counter++;
    });
  }

  void _setColor(String colorName, Color color) {
    setState(() {
      selectedColor = color;
    });
  }

  @override
  Widget build(BuildContext context) {
    final AdWidget adWidget = AdWidget(ad: bannerAd);
    final Container adContainer = Container(
        alignment: Alignment.center,
        width: bannerAd.size.width.toDouble(),
        height: bannerAd.size.height.toDouble(),
        child: adWidget);

    return Scaffold(
      appBar: AppBar(
        title: const Text('ads screen'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            InkWell(
              onTap: _showInterstatialAd,
              child: Container(
                padding:
                    const EdgeInsets.symmetric(vertical: 24, horizontal: 20),
                height: 100,
                color: Colors.orange,
                child: const Text(
                  "Show Interstitial Ad",
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 35,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),
            InkWell(
              onTap: _showRewardedAds,
              child: Container(
                padding:
                    const EdgeInsets.symmetric(vertical: 24, horizontal: 20),
                height: 100,
                color: Colors.blue,
                child: const Text(
                  "Show Rewarded Ad",
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 35,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),
            adContainer
          ],
        ),
      ),
    );
  }
}
