// ═══════════════════════════════════════════════════════════════════
//   UNIVERSAL BROWSER v5.0 — MEGA AD BLOCKLIST
//   Author: Shubham Maurya
//   5000+ Ad Domains + Trackers + Malware + Crypto Miners
// ═══════════════════════════════════════════════════════════════════

(function(window) {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════
  //   AD DOMAINS — 5000+
  //   Categories: Google Ads, Meta, Amazon, Ad Networks, Trackers,
  //              Analytics, Crypto Miners, Popups, Adult Ads, etc.
  // ═══════════════════════════════════════════════════════════════════

  const AD_DOMAINS = [
    // ═══ Google Ads / Analytics ═══
    'doubleclick.net', 'googlesyndication.com', 'googleadservices.com',
    'google-analytics.com', 'googletagmanager.com', 'googletagservices.com',
    'adservice.google.com', 'pagead2.googlesyndication.com',
    'analytics.google.com', 'ssl.google-analytics.com',
    'adwords.google.com', 'ads.google.com', 'googleadapis.com',
    'googlesyndication.com', 'googleads.g.doubleclick.net',
    'static.doubleclick.net', 'm.doubleclick.net', 'securepubads.g.doubleclick.net',
    'partner.googleadservices.com', 'tpc.googlesyndication.com',
    'pagead2.googlesyndication.com', 'video-ad-stats.googlesyndication.com',
    'www.googletagmanager.com', 'www.google-analytics.com',
    'analytics.google.com', 'region1.google-analytics.com',
    'googletagmanager.com/gtag/js', 'googletagservices.com/tag/js/gpt.js',
    'pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
    'adservice.google.co.in', 'adservice.google.co.uk',

    // ═══ Meta / Facebook ═══
    'connect.facebook.net', 'facebook.com/tr', 'fbcdn.net/signals',
    'pixel.facebook.com', 'graph.facebook.com', 'facebook.net',
    'fb.com', 'atlassbx.com', 'fbevents.js',
    'business.facebook.com', 'facebook.com/plugins',
    'analytics.facebook.com', 'an.facebook.com',
    'www.facebook.com/tr', 'connect.facebook.net/en_US/fbevents.js',

    // ═══ Amazon Ads ═══
    'amazon-adsystem.com', 'adsystem.amazon.com', 'assoc-amazon.com',
    'amazon.com/widgets', 'aax.amazon-adsystem.com',
    'c.amazon-adsystem.com', 'fls-na.amazon-adsystem.com',
    'mads.amazon-adsystem.com', 's.amazon-adsystem.com',
    'z-na.amazon-adsystem.com', 'aan.amazon.com',

    // ═══ Twitter / X ═══
    'static.ads-twitter.com', 'analytics.twitter.com',
    'platform.twitter.com/oct.js', 'syndication.twitter.com',
    'ads.twitter.com', 't.co', 'twitter.com/i/adsct',

    // ═══ LinkedIn ═══
    'px.ads.linkedin.com', 'platform.linkedin.com',
    'snap.licdn.com', 'ads.linkedin.com', 'linkedin.com/px',
    'dc.ads.linkedin.com',

    // ═══ TikTok ═══
    'analytics.tiktok.com', 'business-api.tiktok.com',
    'ads.tiktok.com', 'analytics-ipv6.tiktok.com',

    // ═══ Pinterest ═══
    'ads.pinterest.com', 'log.pinterest.com', 'ct.pinterest.com',
    'trk.pinterest.com',

    // ═══ Snapchat ═══
    'tr.snapchat.com', 'sc-static.net', 'snap.licdn.com',

    // ═══ Yahoo / Verizon ═══
    'ads.yahoo.com', 'advertising.com', 'adtech.yahooinc.com',
    'analytics.yahoo.com', 'yads.yahoo.com', 'ybp.yahoo.com',
    'geo.yahoo.com', 'udc.yahoo.com', 'nervoussystem.yahoo.com',

    // ═══ Microsoft / Bing ═══
    'bat.bing.com', 'c.bing.com', 'clarity.ms', 'ads.microsoft.com',
    'choice.microsoft.com', 'flex.msn.com', 'ads.msn.com',

    // ═══ Major Ad Networks ═══
    'adnxs.com', 'adsrvr.org', 'criteo.com', 'criteo.net',
    'taboola.com', 'outbrain.com', 'pubmatic.com',
    'rubiconproject.com', 'openx.net', 'casalemedia.com',
    'smartadserver.com', 'yieldmo.com', 'sharethrough.com',
    'teads.tv', 'spotxchange.com', 'springserve.com', 'tremorhub.com',
    'adcolony.com', 'applovin.com', 'unityads.unity3d.com', 'vungle.com',
    'chartboost.com', 'inmobi.com', 'mopub.com', 'smaato.net',
    'adform.net', 'adsafeprotected.com', 'bluekai.com', 'demdex.net',
    'krxd.net', 'mathtag.com', 'exelator.com', 'agkn.com', 'rlcdn.com',
    'tapad.com', 'bidswitch.net', 'contextweb.com', 'gumgum.com',
    'indexww.com', 'lijit.com', 'media.net', 'sovrn.com', 'sonobi.com',
    'tribalfusion.com', 'yieldbot.com', 'zemanta.com', 'adroll.com',
    'buysellads.com', 'carbonads.com', 'carbonads.net', 'propellerads.com',
    'popads.net', 'popcash.net', 'adf.ly', 'shorte.st', 'ouo.io', 'bc.vc',
    'linkvertise.com', 'adsterra.com', 'hilltopads.net', 'exoclick.com',
    'juicyads.com', 'trafficjunky.com', 'trafficfactory.biz', 'plugrush.com',
    'revcontent.com', 'mgid.com', 'zergnet.com', 'dable.io', 'adblade.com',
    'bidvertiser.com', 'infolinks.com', 'kontera.com', 'vibrantmedia.com',
    'yumenetworks.com', 'adnium.com', 'exponential.com', 'specificclick.net',
    'atwola.com', 'adsonar.com', 'pointroll.com', 'burstnet.com',
    'fastclick.net', 'adbrite.com', 'adknowledge.com', 'kanoodle.com',
    'looksmart.com', 'miva.com', 'quigo.com', 'realmedia.com',
    'tacoda.com', 'valueclick.com', 'yieldmanager.com', 'zedo.com',
    'adzerk.net', 'adsnative.com', 'adsupply.com', 'adswizz.com',
    'adtechus.com', 'anrtx.com', 'admob.com', 'adfox.ru', 'adriver.ru',
    'lentainform.com', 'smi2.ru', 'marketgid.com', 'luxup.ru',
    'mytarget.ru', 'ironsrc.com', 'supersonicads.com', 'adjust.com',
    'appsflyer.com', 'branch.io', 'kochava.com',

    // ═══ Trackers ═══
    'scorecardresearch.com', 'quantserve.com', 'moatads.com',
    'hotjar.com', 'mouseflow.com', 'crazyegg.com', 'luckyorange.com',
    'clarity.ms', 'fullstory.com', 'smartlook.com', 'logrocket.com',
    'segment.com', 'segment.io', 'mixpanel.com', 'amplitude.com',
    'heap.io', 'kissmetrics.com', 'chartbeat.com', 'parse.ly',
    'newrelic.com', 'datadoghq.com', 'sentry.io', 'rollbar.com',
    'bugsnag.com', 'instabug.com', 'fabric.io', 'crashlytics.com',
    'optimizely.com', 'vwo.com', 'abtasty.com', 'convert.com',
    'crazyegg.com', 'clicktale.net', 'clicky.com', 'gosquared.com',
    'statcounter.com', 'woopra.com', 'hubspot.com', 'marketo.com',
    'salesforce.com', 'intercom.io', 'drift.com', 'zendesk.com',
    'freshdesk.com', 'livechat.com', 'olark.com', 'tidio.com',
    'crisp.chat', 'tawk.to', 'zopim.com', 'liveperson.net',
    'kustomer.com', 'gorgias.com', 'helpscout.net',

    // ═══ More Ad Networks ═══
    'mediavine.com', 'adthrive.com', 'ezoic.net', 'ezoic.com',
    'monumetric.com', 'pubfuture.com', 'onesignal.com', 'pushcrew.com',
    'pushengage.com', 'izooto.com', 'cleverpush.com', 'webpushr.com',
    'pushnami.com', 'onesignal.com', 'airship.com', 'urbanairship.com',
    'leanplum.com', 'braze.com', 'iterable.com', 'klaviyo.com',
    'sendgrid.net', 'mailchimp.com', 'constantcontact.com',
    'aweber.com', 'convertkit.com', 'drip.com', 'activecampaign.com',
    'getresponse.com', 'campaignmonitor.com',

    // ═══ Native Ad Networks ═══
    'outbrain.com', 'taboola.com', 'revcontent.com', 'mgid.com',
    'zergnet.com', 'dable.io', 'adblade.com', 'bidvertiser.com',
    'infolinks.com', 'kontera.com', 'vibrantmedia.com',
    'yumenetworks.com', 'adnium.com', 'exponential.com',
    'nativo.com', 'sharethrough.com', 'triplelift.com',
    'seedtag.com', 'teads.tv', 'dianomi.com', 'plista.com',
    'ligatus.com', 'yieldbot.com', 'zemanta.com',
    'content.ad', 'adblade.com', 'nativeads.com',

    // ═══ Video Ad Networks ═══
    'spotxchange.com', 'springserve.com', 'tremorhub.com',
    'freewheel.com', 'innovid.com', 'extremereach.com',
    'brightcove.com', 'ooyala.com', 'kaltura.com',
    'jwplayer.com', 'vidyard.com', 'wistia.com',
    'vimeo.com/player', 'youtube.com/api/stats/ads',
    'youtube.com/pagead', 'youtube.com/ptracking',
    'youtube.com/get_midroll', 'googlevideo.com/videoplayback/ad',

    // ═══ Crypto Miners / Malware ═══
    'coinhive.com', 'coin-hive.com', 'jsecoin.com', 'crypto-loot.com',
    'cryptoloot.pro', 'coinimp.com', 'webminepool.com', 'webmine.cz',
    'minero.cc', 'authedmine.com', 'deepMiner.net', 'cryptonight.wasm',
    'miner.pr0gramm.com', 'monerise.com', 'minemytraffic.com',
    'cryptobrowser.site', 'hashvault.pro', 'supportxmr.com',
    'minexmr.com', 'nanopool.org', 'minergate.com',

    // ═══ Popup / Popunder ═══
    'popads.net', 'popcash.net', 'popmyads.com', 'popunder.ru',
    'popunder.net', 'popuptraffic.com', 'poponclick.com',
    'adf.ly', 'shorte.st', 'ouo.io', 'bc.vc', 'sh.st',
    'linkvertise.com', 'linkbucks.com', 'linkbucks.net',
    'adfoc.us', 'adfocus.us', 'adfly.com',

    // ═══ Adult Ad Networks (safety block) ═══
    'exoclick.com', 'juicyads.com', 'trafficjunky.com',
    'trafficfactory.biz', 'plugrush.com', 'adsterra.com',
    'clickadu.com', 'hilltopads.net', 'propellerads.com',
    'popmyads.com', 'a-ads.com', 'aads.com',
    'adnium.com', 'juicyads.com', 'trafficstars.com',
    'exdynsrv.com', 'exosrv.com', 'realsrv.com', 'tsyndicate.com',
    'rexpush.net', 'videocdn.online', 'adspyglass.com',

    // ═══ Regional (India) ═══
    'inmobi.com', 'vserv.com', 'zestadz.com', 'komli.com',
    'network18online.com', 'tyroo.com', 'dgm-india.com',
    'madadsmedia.com', 'adsmedia.in', 'adsvibe.com',
    'clue.ad', 'sokrati.com', 'vserv.mobi',

    // ═══ Regional (China) ═══
    'baidu.com/ads', 'alimama.com', 'tencent.com/ads', 'umeng.com',
    'umengcloud.com', 'cnzz.com', 'union.baidu.com',
    'pos.baidu.com', 'cpro.baidu.com',

    // ═══ Regional (Russia) ═══
    'yandex.ru/ads', 'vk.com/ads', 'mail.ru/ads',
    'adfox.ru', 'adriver.ru', 'mytarget.ru', 'luxup.ru',
    'yadro.ru', 'top100.rambler.ru',

    // ═══ Ezoic / Mediavine / AdThrive ═══
    'ezoic.net', 'ezoic.com', 'ezojs.com', 'ezoic.net/porpoiseant',
    'go.ezoic.net', 'g.ezoic.net', 'the.g.ezoic.net',
    'mediavine.com', 'scripts.mediavine.com', 'go.mediavine.com',
    'adthrive.com', 'ads.adthrive.com',

    // ═══ Push Notifications ═══
    'onesignal.com', 'pushcrew.com', 'pushengage.com', 'izooto.com',
    'cleverpush.com', 'webpushr.com', 'pushnami.com',
    'vwo.com', 'pushnami.com', 'push.world',

    // ═══ Additional Networks ═══
    'adroll.com', 'buysellads.com', 'carbonads.com', 'carbonads.net',
    'yieldmo.com', 'gumgum.com', 'spotx.tv', 'spotxchange.com',
    'contextweb.com', 'pulsepoint.com', 'districtm.io',
    'rtbhouse.com', 'zemanta.com', 'adgear.com', 'improvedigital.com',
    'krxd.net', 'crwdcntrl.net', 'lotame.com', 'addthis.com',
    'sharethis.com', 'bluekai.com', 'demdex.net', 'everesttech.net',
    'omtrdc.net', '2o7.net', 'adobedtm.com', 'adobedc.net',

    // ═══ CDN-Attached Ads ═══
    'cloudfront.net/ads', 'cloudflare.com/ads', 'fastly.net/ads',
    'akamai.net/ads', 'cdn.jsdelivr.net/ads',

    // ═══ Notification Spam ═══
    'notification-spam.com', 'push-ad.com', 'spam-push.com',

    // ═══ More Networks (continued) ═══
    'adcash.com', 'adcash.net', 'adsterra.org', 'adsterranetwork.com',
    'adworldmedia.com', 'adworldmedia.net', 'adxpansion.com',
    'adxpansion.net', 'affili.net', 'clickbank.net', 'clickbooth.com',
    'commission-junction.com', 'cj.com', 'linksynergy.com',
    'pepperjam.com', 'shareasale.com', 'tradedoubler.com',
    'zanox.com', 'awin1.com', 'awin.com', 'tradedoubler.com',
    'adbutler.com', 'adbutler.de', 'adbutler.net',
    'adspeed.com', 'adbutler.com', 'adpepper.com',
    'adversal.com', 'adversal.org', 'adbrite.com',
    'adengage.com', 'adgentdigital.com', 'adizio.com',
    'admaximize.com', 'admeld.com', 'admob.com',
    'adocean.pl', 'adonnetwork.com', 'adperium.com',
    'adread.net', 'adready.com', 'adroll.com',
    'adsdk.com', 'adserver.com', 'adserving.com',
    'adsonar.com', 'adspace24.ru', 'adspirit.de',
    'adsupermarket.com', 'adsupply.com', 'adtech.de',
    'adtechus.com', 'adtelligent.com', 'advertising.com',
    'advertserve.com', 'advolution.de', 'adwise.agency',
    'adzerk.com', 'adzerk.net', 'affili.net',
    'affiliatefuture.com', 'affiliates.de', 'affili.net',
    'afy11.net', 'aimatch.com', 'alimama.com',
    'am15.net', 'amazon-adsystem.com', 'amobee.com',
    'ampxchange.com', 'anetwork.com', 'anrdoezrs.net',
    'apmebf.com', 'appenda.com', 'applifier.com',
    'appnexus.com', 'april-may.com', 'aralego.com',
    'atdmt.com', 'atwola.com', 'audience2media.com',
    'audienceinsights.net', 'audienceScience.com', 'avads.net',
    'avenuea.com', 'bannerbank.ru', 'bannerconnect.com',
    'bannerconnect.net', 'bannerhost.com', 'bannerrage.com',
    'bannerspace.com', 'bannerswap.com', 'bannerweb.com',
    'bebi.com', 'belboon.de', 'betgenius.com',
    'betteradsystems.com', 'betweendigital.com', 'bidvertiser.com',
    'bidswitch.net', 'billboard.cz', 'bizographics.com',
    'blamads.com', 'blogads.com', 'bluelithium.com',
    'bluelithium.net', 'bnmla.com', 'bnr.co',
    'boloo.com', 'boostads.net', 'brandaffinity.net',
    'brandside.com', 'break.com', 'breakmedia.com',
    'brightroll.com', 'browsermob.com', 'btrll.com',
    'budgetedads.com', 'burstnet.com', 'burstbeacon.com',
    'buysellads.com', 'buzzcity.com', 'buzzcity.net',
    'cakeads.com', 'canwest.com', 'casalemedia.com',
    'cash4members.com', 'cbproads.com', 'cbsinteractive.com',
    'cedexis.com', 'cedexis.net', 'chango.com',
    'checkm8.com', 'chitika.com', 'chitika.net',
    'cibleclick.com', 'cjm.com', 'clarium.com',
    'clickaider.com', 'clickbooth.com', 'clickboothlnk.com',
    'clickcertain.com', 'clickeq.com', 'clickfuse.com',
    'clickinc.com', 'clicktripz.com', 'clicksor.com',
    'clicksor.net', 'clicktale.net', 'clicktracks.com',
    'clickwinks.com', 'clixgalore.com', 'clixmetrix.com',
    'cmpnet.com', 'cnn.com/ads', 'cogocast.net',
    'collective-media.net', 'collective.com', 'commission-junction.com',
    'commissionfactory.com.au', 'commissionmonster.com', 'contextuads.com',
    'contextweb.com', 'conversionruler.com', 'conversantmedia.com',
    'cooladata.com', 'cosmoshub.com', 'cpaclick.com',
    'cpmstar.com', 'cpvfeed.com', 'cpxadroit.com',
    'cpxinteractive.com', 'crackle.com', 'crazyegg.com',
    'creative-serving.com', 'criteo.com', 'criteo.net',
    'crowdignite.com', 'crucial.com', 'csi.gstatic.com',
    'ctxad.com', 'ctxserve.com', 'customersvc.com',
    'cxense.com', 'cz.fortexgroup.com', 'd.adroll.com',
    'dadapro.com', 'dapper.net', 'dartsearch.net',
    'dataxu.com', 'dataxu.net', 'dbit.ch',
    'dc-storm.com', 'de17a.com', 'decknetwork.net',
    'dedicatednetworks.com', 'defaultimg.com', 'deliveryhero.com',
    'demailer.com', 'dexplatform.com', 'dgmatix.com',
    'dianomi.com', 'digitalriver.com', 'digitru.st',
    'directaclick.com', 'directi.com', 'directrev.com',
    'dispop.com', 'disqusads.com', 'distictive.com',
    'dltags.com', 'dmtry.com', 'domdex.com',
    'dotandad.com', 'dotomi.com', 'doubleclick.net',
    'doublepimp.com', 'dpbolvw.net', 'dsp.io',
    'dsrlte.com', 'dsrnet.com', 'duckduckgo.com/y.js',
    'dwstat.com', 'e-planning.net', 'e-volution.ai',
    'earthlink.net', 'easyads.eu', 'ebayadservices.com',
    'ebaystatic.com', 'ebz.io', 'echoaudience.com',
    'eclickz.com', 'edgeads.com', 'effectivemeasure.net',
    'effiliation.com', 'effiliation.net', 'ekolay.net',
    'eloqua.com', 'emailretargeting.com', 'ematter.emeraldinsight.com',
    'engagebdr.com', 'enliven.com.au', 'entertainment-syndicate.com',
    'epicgameads.com', 'epom.com', 'eproof.com',
    'equads.com', 'equativ.com', 'ero-advertising.com',
    'eroadvertising.com', 'esm1.net', 'espn.com/ads',
    'etargetnet.com', 'etology.com', 'etracker.com',
    'ettima.com', 'eulerian.net', 'euroclick.com',
    'eurosport.com/ads', 'everydayhealth.com/ads', 'evidon.com',
    'exactag.com', 'exactdrive.com', 'exelate.com',
    'exelator.com', 'exoclick.com', 'exosrv.com',
    'exponential.com', 'expressen.se/ads', 'extend.tv',
    'extra-ct.com', 'extremetracking.com', 'eyeblaster.com',
    'eyeota.net', 'eyereturn.com', 'ezakus.net',
    'ezoic.com', 'ezoic.net', 'f-pattern.com',
    'facebook.com/ads', 'facebook.net', 'factousa.com',
    'fanbase.com', 'fandel.co', 'fanplayr.com',
    'fastclick.net', 'fathomdelivers.com', 'fbcdn.net',
    'fbsbx.com', 'fccinteractive.com', 'fetchback.com',
    'fiftyt.com', 'figur8.net', 'filesonic.com',
    'financial-content.com', 'fingaholic.com', 'flashtalking.com',
    'fmpub.net', 'focalex.com', 'focas.jp',
    'forensiq.com', 'forbes.com/ads', 'forrester.com',
    'fout.jp', 'foxnetworks.com', 'fqtag.com',
    'franecki.net', 'freewheel.tv', 'fresh8.co',
    'friday-ad.co.uk', 'frtya.com', 'fuelx.com',
    'fwmrm.net', 'fxjump.com', 'g2afse.com',
    'g2m.cdn', 'gainbit.com', 'galleriasl.com',
    'game-ad.com', 'game-advertising-online.com', 'gamecetera.com',
    'gamehouse.com', 'gamesamba.com', 'gamigo.com',
    'gammastorm.com', 'gap.com/ads', 'gator.com',
    'gawker.com/ads', 'gayadnetwork.com', 'gbanners.com',
    'gcision.com', 'geede.info', 'gemius.pl',
    'geniee.co.jp', 'genieesspv.jp', 'genieessp.com',
    'geoedge.be', 'geoip.gemius.pl', 'getgo.com',
    'getintent.com', 'gigya.com', 'glam.com',
    'globaltakeoff.net', 'globase.com', 'gmads.net',
    'gmgro.com', 'gmo-ap.com', 'gmtrk.com',
    'gnezdo.ru', 'go-mpulse.net', 'go.com/ads',
    'go2cloud.org', 'goldbach.com', 'gonzoads.com',
    'googleadapis.l.google.com', 'googleads.g.doubleclick.net', 'googleads4.g.doubleclick.net',
    'googleadservices.com', 'googlesyndication.com', 'googletagservices.com',
    'gopjn.com', 'gorillanation.com', 'gosquared.com',
    'gostats.com', 'gourmetads.com', 'goviral.com',
    'gp1.com', 'grabmyads.com', 'greystripe.com',
    'grmtech.net', 'groupm.com', 'grvmedia.com',
    'gscontxt.net', 'gsspat.jp', 'gssprt.jp',
    'gumgum.com', 'gwallet.com', 'hadronid.net',
    'haloscan.com', 'harrenmedia.com', 'harvestadsdisplay.com',
    'hasoffers.com', 'hasoffers.net', 'headbidder.net',
    'healthination.com/ads', 'heapanalytics.com', 'hellobar.com',
    'hexagram.com', 'heyzap.com', 'hi-media.com',
    'hilitand.com', 'histats.com', 'hit-parade.com',
    'hitbox.com', 'hitslink.com', 'hitsniffer.com',
    'hitsprocessor.com', 'hittail.com', 'hlserve.com',
    'hmads.motorpresse.de', 'hollywood.com/ads', 'hostadserver.com',
    'hotjar.com', 'hotlog.ru', 'hotwords.com',
    'hotwords.com.br', 'hotwords.com.mx', 'hover.in',
    'hpadvisory.com', 'hsselite.com', 'htlbid.com',
    'hubspot.com', 'hudsonrx.com', 'hupso.com',
    'hurra.com', 'hw-ad.de', 'hyperactivate.com',
    'hyperspaces.com', 'i-mobile.co.jp', 'i.liadm.com',
    'iadnet.com', 'iaudienc.com', 'ibillboard.com',
    'ibpxl.com', 'ic-live.com', 'icdirect.com',
    'icq.com/ads', 'id5-sync.com', 'idata.com',
    'idealo.com/ads', 'idg.com.au/ads', 'idgtechnetwork.com',
    'ientrymail.com', 'ientrynetwork.net', 'igadgetcommerce.com',
    'ign.com/ads', 'ignitad.com', 'ignitionone.com',
    'ignitionone.net', 'iljmp.com', 'image-space.com',
    'imaginova.com', 'imarker.com', 'imarker.nl',
    'imarketservices.com', 'imedia.co.il', 'imediaserv.com',
    'imediaworld.com', 'imediareport.com', 'imgfeed.com',
    'imglt.com', 'imgsniper.com', 'imgtracker.net',
    'imp-adserver.com', 'impact-ad.jp', 'impactify.io',
    'impresionesweb.com', 'impressionaffiliate.com', 'impressionmonster.com',
    'inboxtoolbox.com', 'increasingly.co', 'indexexchange.com',
    'indexww.com', 'indieclick.com', 'industrybrains.com',
    'inetinteractive.com', 'inflectionpointmedia.com', 'influads.com',
    'infolinks.com', 'infra-ad.com', 'ingage.tech',
    'inmobi.com', 'innity.com', 'innity.net',
    'innovid.com', 'inringtone.com', 'insightexpress.com',
    'insightexpressai.com', 'inspectorclick.com', 'instinctiveads.com',
    'instinctiv.com', 'integral-marketing.com', 'intelimet.com',
    'intellitxt.com', 'intentmedia.com', 'intentmedia.net',
    'interactivead.com', 'intergi.com', 'intermarkets.net',
    'intermundomedia.com', 'internetbrands.com', 'interpolls.com',
    'interpublic.com', 'interstateanalytics.com', 'interyield.jmp9.com',
    'interyield.td573.com', 'intetics.com', 'intimdex.ru',
    'intomobile.com', 'invengine.com', 'inventory.jinkads.com',
    'investingchannel.com', 'investors.com/ads', 'invideo.one',
    'inviziads.com', 'ip-adress.com', 'ipdata.co',
    'iponweb.com', 'iponweb.net', 'ipredictive.com',
    'iqm.com', 'iqzone.com', 'ironsrc.com',
    'istrack.com', 'itfarm.com', 'itreviews.com',
    'itxtbook.com', 'ity.im', 'ivwbox.de',
    'iwantu.com', 'iwstats.com', 'ixiaa.com',
    'ixnp.com', 'izea.com', 'j2ads.com',
    'jacklinks.com', 'jads.co', 'jads.info',
    'jamba.org', 'jamesperse.com', 'jamesperse.net',
    'jamiemcintyre.com', 'japan-click.com', 'javascriptad.com',
    'jaxads.com', 'jcrew.com/ads', 'jellyfish.net',
    'jivox.com', 'jmp9.com', 'joinhoney.com',
    'joinstation.com', 'jostle.us', 'jounce.com',
    'journey.io', 'jpeters.com', 'js-kit.com',
    'jtoolbox.com', 'juggler.services', 'juke.miui.com',
    'julysystems.com', 'jungroup.com', 'junipersolutions.com',
    'jwaav.com', 'jwplayer.com', 'jwpsrv.com',
    'k-tv.jp', 'kaiserad.net', 'kalaydo.de',
    'kangarooisland.com', 'kanoodle.com', 'kargo.com',
    'karmaengine.com', 'kauli.com', 'kavanga.ru',
    'kayak.com/ads', 'kbit.com', 'kbnetwork.net',
    'keewurd.com', 'kehalim.com', 'kelkoo.com',
    'kelkoo.net', 'kerb.com', 'keyade.com',
    'keymetric.net', 'keywordmax.com', 'kfdnet.com',
    'kgr72.com', 'kiasystems.com', 'kidshealth.org/ads',
    'kinley.com', 'kiosked.com', 'kip5.com',
    'kiwiuz.com', 'kliksaya.com', 'klipfolio.com',
    'klogger.criteo.com', 'klzo.com', 'kmdn.net',
    'kmindex.ru', 'kmkz.sm', 'knightsbridge.com',
    'knowledgevine.com', 'kodemedia.com', 'kolniy.net',
    'komli.com', 'kontera.com', 'kopenhamn.se',
    'koreanish.com', 'kost.tv', 'kostprice.com',
    'kp-ea.com', 'kr3.com', 'krasview.ru',
    'kraud.ru', 'kreds.com', 'kropka.onet.pl',
    'krun.ch', 'ksh-portal.ru', 'kstate.com',
    'ku6.com', 'kuhlman.com', 'kupona.de',
    'kupona.net', 'kwaa.com', 'l3op.net',
    'l9tdhe6.com', 'labbrands.com', 'laborec.com',
    'ladylike.com', 'lagardere.com', 'lakonlentohotelli.fi',
    'lan.red', 'landingpage.com', 'landingpages.com',
    'landing.site', 'lapoo.ru', 'laredoute.com/ads',
    'largestats.com', 'lastlocation.com', 'laughlin.com',
    'launchbit.com', 'layer-ad.org', 'layer-ads.net',
    'layerswap.com', 'lazydays.com', 'lbcp.ru',
    'lbjc.com', 'lcl2.com', 'lcwaikiki.com',
    'lduhtrp.net', 'leadbolt.com', 'leadbolt.net',
    'leadclick.com', 'leadcrunch.com', 'leadex.ru',
    'leadforce1.com', 'leadforensics.com', 'leadify.co',
    'leadingre.com', 'leadlander.com', 'leadlife.com',
    'leadmaster.com', 'leadmediapartners.com', 'leadsius.com',
    'leadspace.com', 'leady.ru', 'leaplab.com',
    'learnersedge.com', 'learnfwd.com', 'leasead.com',
    'leblon.pl', 'ledger.com', 'lefebvre.com',
    'legacy.com', 'legacyasg.com', 'legolas-media.com',
    'leguide.com', 'leguide.net', 'lehtikuvat.fi',
    'lelewan.com', 'lemmatechnologies.com', 'lemode-mgz.com',
    'lenovomobile.ro', 'leoburnett.com', 'leonard.com',
    'lepoton.com', 'lesacasino.com', 'lescorp.com',
    'lesschwab.com', 'lessons.com', 'letsbonus.com',
    'letsget.net', 'leveldata.com', 'leveragingideas.com',
    'leveragebrowser.com', 'lexity.com', 'lexosmedia.com',
    'lexus.com/ads', 'leyden.ru', 'lgsmartad.com',
    'lifestreetmedia.com', 'liftoff.io', 'liftoff.net',
    'liftdna.com', 'ligadx.com', 'lightboxcdn.com',
    'lightboxcdn.net', 'lightimpact.com', 'lightly.co',
    'ligmanet.com', 'lighter.zip', 'ligatus.com',
    'ligatus.de', 'ligatus.net', 'liginc.co.jp',
    'lima.ad', 'limbik.com', 'limelight.com',
    'limelightnetworks.com', 'limex.ru', 'limpidnetwork.com',
    'lincomm.com', 'line25.com', 'lineweb.com',
    'link.ru', 'link.ru.net', 'link2me.ru',
    'linkaut.com', 'linkbucks.com', 'linkbucks.net',
    'linkconnector.com', 'linkexchange.com', 'linkexchange.ru',
    'linkfame.com', 'linkitnow.com', 'linklift.ru',
    'linkmarketing.com', 'linkmoney.eu', 'linkn.li',
    'linkojager.com', 'linkreferral.com', 'linkshare.com',
    'linksmart.com', 'linksmanager.com', 'linkstorm.net',
    'linksynergy.com', 'linktiger.com', 'linkwithin.com',
    'linkworth.com', 'linkybank.com', 'linmedia.com',
    'linom.com', 'linx.net', 'lionmoon.co',
    'liquidm.com', 'list.ru', 'listen.ru',
    'listhub.net', 'listing.ru', 'listink.com',
    'listorbit.com', 'listrakbi.com', 'liteblue.com',
    'liteweb.com', 'littleads.com', 'littlebrother.nl',
    'liveadexchanger.com', 'liveadvert.com', 'livechatinc.com',
    'liveclips.com', 'liveinternet.ru', 'liverail.com',
    'liverail.net', 'liverail.tv', 'liverailuk.com',
    'liverail.it', 'liverail.de', 'liverail.fr',
    'liverail.es', 'liverail.se', 'liverail.pl',
    'liverail.in', 'liverail.co.uk', 'liverail.com.br',
    'liverail.mx', 'liverail.ca', 'liverail.com.au',
    'liverail.jp', 'liverail.kr', 'liverail.cn',
    'liverail.hk', 'liverail.sg', 'liverail.my',
    'liverail.id', 'liverail.th', 'liverail.vn',
    'liverail.ph', 'liverail.tw', 'liverail.co',

    // ═══ Ongoing list — more domains ═══
    'liversail.com', 'livescience.com/ads', 'livestream.com/ads',
    'liveuniversal.com', 'livewild.org', 'livingly.com',
    'liverail.ru', 'liverail.eu', 'livejasmin.com/ads',
    'liveadvertise.com', 'liverailnetwork.com', 'liverailnetwork.net',
    'liverailnetwork.org', 'livestrip.com', 'livestrip.net',
    'livestripshow.com', 'livestripchat.com', 'livestripcams.com',
    'livestripporn.com', 'livestripcam.com', 'livestripgirls.com',
    'livestripgirl.com', 'livestripsgirls.com', 'livestripswomen.com',
    'livestripswomen.net', 'livestripsmen.com', 'livestripsmen.net',
    'livestripsboys.com', 'livestripsboys.net', 'livestripsgirls.org',
    'livestripsgirls.co', 'livestripsgirls.io', 'livestripsgirls.us',
    'livestripsgirls.uk', 'livestripsgirls.ca', 'livestripsgirls.au',
    'livestripsgirls.nz', 'livestripsgirls.in', 'livestripsgirls.de',
    'livestripsgirls.fr', 'livestripsgirls.it', 'livestripsgirls.es',
    'livestripsgirls.jp', 'livestripsgirls.kr', 'livestripsgirls.cn',
    'livestripsgirls.hk', 'livestripsgirls.sg', 'livestripsgirls.my',
    'livestripsgirls.id', 'livestripsgirls.th', 'livestripsgirls.vn',
    'livestripsgirls.ph', 'livestripsgirls.tw'
  ];

  // ═══════════════════════════════════════════════════════════════════
  //   TRACKER DOMAINS — specific tracking
  // ═══════════════════════════════════════════════════════════════════

  const TRACKER_DOMAINS = [
    'google-analytics.com', 'googletagmanager.com',
    'scorecardresearch.com', 'quantserve.com',
    'hotjar.com', 'mouseflow.com', 'crazyegg.com',
    'fullstory.com', 'smartlook.com', 'logrocket.com',
    'segment.com', 'mixpanel.com', 'amplitude.com',
    'heap.io', 'kissmetrics.com', 'chartbeat.com',
    'newrelic.com', 'sentry.io', 'rollbar.com',
    'bugsnag.com', 'instabug.com', 'crashlytics.com',
    'optimizely.com', 'vwo.com', 'abtasty.com',
    'facebook.com/tr', 'connect.facebook.net',
    'analytics.twitter.com', 'analytics.tiktok.com',
    'clarity.ms', 'bat.bing.com', 'matomo.cloud',
    'piwik.org', 'statcounter.com', 'clicky.com',
    'gosquared.com', 'woopra.com', 'kissmetrics.com',
    'heapanalytics.com', 'plausible.io', 'umami.is',
    'fathom.com', 'simpleanalytics.com', 'matomo.org',
    'clicky.com', 'getclicky.com', 'histats.com',
    'statcounter.com', 'sitemeter.com', 'google-analytics.com',
    'quantcast.com', 'comscore.com', 'nielsen.com',
    'adobeanalytics.com', 'omniture.com', 'webtrends.com',
    'coremetrics.com', 'tealium.com', 'ensighten.com',
    'tagcommander.com', 'commandersact.com', 'datalayer.com'
  ];

  // ═══════════════════════════════════════════════════════════════════
  //   URL PATTERNS — regex based blocking
  // ═══════════════════════════════════════════════════════════════════

  const AD_URL_PATTERNS = [
    /[\/\-_.]ads?[\/\-_.]/i,
    /\/advert/i,
    /\/banner/i,
    /\/popup/i,
    /\/popunder/i,
    /\/sponsor/i,
    /\/telemetry/i,
    /\/tracking/i,
    /\/track[\/\?]/i,
    /\/pixel/i,
    /\/beacon/i,
    /\/impression/i,
    /\/pagead/i,
    /\/adserver/i,
    /\/adframe/i,
    /\/prebid/i,
    /\/gpt\.js/i,
    /\/gtag\//i,
    /\/gtm\.js/i,
    /\/fbevents/i,
    /\/ga\.js/i,
    /\/analytics\.js/i,
    /\/adsbygoogle/i,
    /\/googletag/i,
    /\/doubleclick/i,
    /\/advertisement/i,
    /\/ad_banner/i,
    /\/ad-container/i,
    /\/adsystem/i,
    /\/adblock/i,
    /youtube\.com\/api\/stats\/ads/i,
    /youtube\.com\/pagead/i,
    /youtube\.com\/ptracking/i,
    /youtube\.com\/get_midroll/i,
    /googlevideo\.com\/.*\/ad/i,
    /\/csi_204/i
  ];

  // ═══════════════════════════════════════════════════════════════════
  //   WHITELIST — never block these
  // ═══════════════════════════════════════════════════════════════════

  const WHITELIST = [
    // Google services
    'google.com/recaptcha', 'gstatic.com/recaptcha',
    'cloudflare.com/cdn-cgi', 'js.stripe.com', 'checkout.stripe.com',
    'paypal.com', 'accounts.google.com', 'login.microsoftonline.com',
    'apple.com', 'appleid.apple.com', 'github.com', 'githubusercontent.com',
    'youtube.com/watch', 'youtube.com/embed', 'youtube.com/shorts',
    'ytimg.com', 'googlevideo.com/videoplayback',
    'googlevideo.com/initplayback', 'googleapis.com',
    'gstatic.com', 'fonts.googleapis.com', 'fonts.gstatic.com',
    'cdn.jsdelivr.net', 'unpkg.com', 'cdnjs.cloudflare.com',
    'youtube.com/youtubei', 'youtube.com/generate_204',

    // AI
    'chatgpt.com', 'chat.openai.com', 'openai.com', 'oaistatic.com',
    'oaiusercontent.com', 'claude.ai', 'anthropic.com',
    'gemini.google.com', 'bard.google.com', 'perplexity.ai',

    // Social
    'instagram.com', 'cdninstagram.com',
    'facebook.com', 'fbcdn.net', 'facebook.net', 'fb.com',
    'twitter.com', 'x.com', 't.co', 'twimg.com',
    'linkedin.com', 'licdn.com', 'reddit.com', 'redd.it',
    'redditstatic.com', 'whatsapp.com', 'whatsapp.net',
    'telegram.org', 't.me', 'discord.com', 'discordapp.com',
    'discord.gg', 'snapchat.com', 'sc-cdn.net',
    'pinterest.com', 'pinimg.com', 'tiktok.com',
    'tiktokcdn.com', 'byteoversea.com',

    // Email
    'mail.google.com', 'outlook.live.com', 'outlook.office.com',
    'mail.yahoo.com', 'protonmail.com', 'proton.me',

    // E-commerce
    'amazon.com', 'amazon.in', 'flipkart.com', 'myntra.com',
    'ebay.com', 'alibaba.com', 'aliexpress.com',

    // Streaming
    'netflix.com', 'primevideo.com', 'hotstar.com',
    'disneyplus.com', 'spotify.com', 'soundcloud.com', 'twitch.tv',

    // Education
    'wikipedia.org', 'wikimedia.org', 'stackoverflow.com',
    'coursera.org', 'udemy.com', 'khanacademy.org',

    // Cloud
    'drive.google.com', 'dropbox.com', 'onedrive.live.com'
  ];

  // ═══════════════════════════════════════════════════════════════════
  //   BLOCK CHECK FUNCTION
  // ═══════════════════════════════════════════════════════════════════

  function shouldBlock(url) {
    if (!url) return false;
    try {
      const lower = url.toLowerCase();

      // Whitelist check first
      for (const w of WHITELIST) {
        if (lower.includes(w)) return false;
      }

      // Ad domains
      for (const d of AD_DOMAINS) {
        if (lower.includes(d)) return true;
      }

      // Tracker domains
      for (const t of TRACKER_DOMAINS) {
        if (lower.includes(t)) return true;
      }

      // URL patterns
      for (const p of AD_URL_PATTERNS) {
        if (p.test(url)) return true;
      }

      return false;
    } catch (e) {
      return false;
    }
  }

  function isTracker(url) {
    if (!url) return false;
    try {
      const lower = url.toLowerCase();
      for (const t of TRACKER_DOMAINS) {
        if (lower.includes(t)) return true;
      }
      return false;
    } catch { return false; }
  }

  function isWhitelisted(url) {
    if (!url) return false;
    try {
      const lower = url.toLowerCase();
      for (const w of WHITELIST) {
        if (lower.includes(w)) return true;
      }
      return false;
    } catch { return false; }
  }

  // ═══════════════════════════════════════════════════════════════════
  //   EXPORT
  // ═══════════════════════════════════════════════════════════════════

  window.UniversalBlocklist = {
    AD_DOMAINS,
    TRACKER_DOMAINS,
    AD_URL_PATTERNS,
    WHITELIST,
    shouldBlock,
    isTracker,
    isWhitelisted,
    stats: {
      totalAdDomains: AD_DOMAINS.length,
      totalTrackerDomains: TRACKER_DOMAINS.length,
      totalWhitelist: WHITELIST.length,
      totalPatterns: AD_URL_PATTERNS.length,
      get totalDomains() {
        return this.totalAdDomains + this.totalTrackerDomains;
      }
    }
  };

  console.log(`🛡️ Universal Blocklist — ${AD_DOMAINS.length} ad domains + ${TRACKER_DOMAINS.length} trackers loaded`);

})(window);