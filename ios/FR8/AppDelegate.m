/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RNSplashScreen.h"
#import <RNCPushNotificationIOS.h>
#import "RNNotifications.h"
//#import <RadarSDK/RadarSDK.h>
#import <RNBranch/RNBranch.h>
#import "ViewController.m"
#import <TSBackgroundFetch/TSBackgroundFetch.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <React/RCTLinkingManager.h> // <- Add This Import

NSString *myText;
NSString *myTextBody;
@import GoogleMaps;
//#import <GoogleMaps/GoogleMaps.h>
#define SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO(v)  ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] != NSOrderedAscending)


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
#ifdef DEBUG
//    [RNBranch useTestInstance];
#endif // DEBUG
  [self clBackgroundLocationSet];
[RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES];
  [[FBSDKApplicationDelegate sharedInstance] application:application
                        didFinishLaunchingWithOptions:launchOptions];
  
   // [REQUIRED] Register BackgroundFetch
   [[TSBackgroundFetch sharedInstance] didFinishLaunching];
  
  
  
  if (@available(iOS 14, *)) {
    UIDatePicker *picker = [UIDatePicker appearance];
    picker.preferredDatePickerStyle = UIDatePickerStyleWheels;
  }
  
  
    //cleint radar key test
//  [Radar       initializeWithPublishableKey:@"prj_test_pk_8b77a44dcaecd87da62b051170a3254cbe664ca4"];
  //cleint radar key live
//  [Radar initializeWithPublishableKey:@"prj_live_pk_2f0afa41ecaedc9fc85e411d7a02b3985e795899"];
  // local key
//    [Radar       initializeWithPublishableKey:@"prj_test_pk_c168e0d2f4326ba70c1d9340f37738252e4e57ba"];
 [RNNotifications startMonitorNotifications];
  [self registerForNotification];
//  [GMSServices provideAPIKey:@"AIzaSyBEjG14L50FxgqxXcxgH_J7rzFFPYnqahY"];
  [GMSServices provideAPIKey:@"AIzaSyAId9HPoVrtc6rDn9O-tAWERRJEelhkARc"];
  
//  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
//    center.delegate = self;
//   
   

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"FR8"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
//  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
//  center.delegate = self;
////    UNUserNotificationCenter * center=[UNUserNotificationCenter currentNotificationCenter];
//    [center requestAuthorizationWithOptions:(UNAuthorizationOptionBadge | UNAuthorizationOptionSound | UNAuthorizationOptionAlert)
//    completionHandler:^(BOOL granted, NSError * _Nullable error) {
//        if (!error) {
  //            NSLog(@"request authorization succeeded!");
//        }
//    }];
  [RNSplashScreen show];
  setThreadPriority:(1.0);
  return YES;
}
-(void)clBackgroundLocationSet{
  CLLocationManager *manager = [[CLLocationManager alloc] init];
  manager.allowsBackgroundLocationUpdates=true;
  if (@available(iOS 11.0, *)) {
    manager.showsBackgroundLocationIndicator=true;
  }
  manager.pausesLocationUpdatesAutomatically=false;
    manager.delegate = self;
     [manager requestAlwaysAuthorization];
    //Here you set the Distance Filter that you need
    manager.distanceFilter = kCLDistanceFilterNone;
    // Here you set the Accuracy
    manager.desiredAccuracy = kCLLocationAccuracyBestForNavigation;
  NSLog(@"startUpdatingLocation %f",manager.desiredAccuracy);
    CLAuthorizationStatus status = [CLLocationManager authorizationStatus];
  NSLog(@"startUpdatingLocation %d" , status);
 [manager startUpdatingLocation];
}


- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  [RNNotifications didFailToRegisterForRemoteNotificationsWithError:error];
}

// Required to register for notifications
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
  [RNCPushNotificationIOS didRegisterUserNotificationSettings:notificationSettings];
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  [RNNotifications didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}

// Required for the register event.
//- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
//{
//  [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
//}
// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
// Required for the registrationError event.
//- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
//{
//  [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
//}
// Required for the localNotification event.
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
  [RNCPushNotificationIOS didReceiveLocalNotification:notification];
}
//- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
//{
// [RNCPushNotificationIOS didRegisterUserNotificationSettings:notificationSettings];
//}
//// Required for the register event.
//- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
//{
// [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
//}
//// Required for the notification event. You must call the completion handler after handling the remote notification.
//- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
//fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
//{
//  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
//}
//// Required for the registrationError event.
//- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
//{
// [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
//}
//// IOS 10+ Required for localNotification event
//- (void)userNotificationCenter:(UNUserNotificationCenter *)center
//didReceiveNotificationResponse:(UNNotificationResponse *)response
//         withCompletionHandler:(void (^)(void))completionHandler
//{
//  [RNCPushNotificationIOS didReceiveNotificationResponse:response];
//  completionHandler();
//}
//// IOS 4-10 Required for the localNotification event.
//- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
//{
// [RNCPushNotificationIOS didReceiveLocalNotification:notification];
//}

- (void)applicationWillResignActive:(UIApplication *)application {
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}


- (id) init
{
    self = [super init];
    if (!self) return nil;

[[NSNotificationCenter defaultCenter] addObserver:self
      selector:@selector(receiveTestNotification:)
      name:@"TestNotification"
      object:nil];
  [[NSNotificationCenter defaultCenter] addObserver:self
        selector:@selector(receiveTestNotificationRR:)
        name:@"TestNotifications"
        object:nil];

  return self;
}


- (void) receiveTestNotificationRR:(NSNotification *) notification
{
  
  NSLog (@"Successfully received test notification! %@", notification.userInfo);
  if ([notification.name isEqualToString:@"TestNotifications"])
  {
      NSDictionary* userInfo = notification.userInfo;
      NSString* text = (NSString*)userInfo[@"myText"];
    NSString* textBody = (NSString*)userInfo[@"myTextBody"];
    myText=text;
    myTextBody=textBody;
  }
}


- (void) receiveTestNotification:(NSNotification *) notification
{
 
  
  
  NSString * language = [[NSLocale preferredLanguages] objectAtIndex:0];
  NSString *text;
  NSString *title;
  
  
  if([myText rangeOfString:@"empty"].location == NSNotFound&&[myTextBody rangeOfString:@"empty"].location == NSNotFound){
    title=myText;
    text=myTextBody;
  }
  else{
  if ([language rangeOfString:@"en"].location == NSNotFound) {
    if([language rangeOfString:@"es"].location==NSNotFound){
      if([language rangeOfString:@"pt"].location==NSNotFound){
//        text=@"Please open FR8 app.";
        title=@"Open the App to Sync your Status";
        text=@"For the best experience, allow the FR8 App to remain open in the background. This keeps your timeline and terminal time stamp accurate.";
      }
      else{
        title=@"Abra o aplicativo para sincronizar seu status";
        text=@"Para obtener la mejor experiencia, permita que la aplicación FR8 permanezca abierta en segundo plano. Esto mantiene su línea de tiempo y el sello de tiempo del terminal precisos.";
      }
    }
    else{
      title=@"Abra la aplicación para sincronizar su estado";
      text=@"Para obter a melhor experiência, deixe o aplicativo FR8 permanecer aberto em segundo plano. Isso mantém a sua linha do tempo e o carimbo de hora do terminal precisos.";
    }
  } else {
    title=@"Open the App to Sync your Status";
    text=@"For the best experience, allow the FR8 App to remain open in the background. This keeps your timeline and terminal time stamp accurate.";
  }
  }
  
  
  
  UNMutableNotificationContent *content = [[UNMutableNotificationContent alloc] init];
//        content.title = [NSString localizedUserNotificationStringForKey:@"Elon said:"
//                                                            arguments:nil];
  content.title=title;
  content.body = text;
  content.sound = [UNNotificationSound soundNamed:@"update_type1.wav"];

  // Deliver the notification in five seconds.
  UNTimeIntervalNotificationTrigger *trigger = [UNTimeIntervalNotificationTrigger
                                              triggerWithTimeInterval:2.f
                                              repeats:NO];
  UNNotificationRequest *request = [UNNotificationRequest requestWithIdentifier:@"FiveSecond"
                                                                      content:content
                                                                      trigger:trigger];
  /// 3. schedule localNotification
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  [center addNotificationRequest:request withCompletionHandler:^(NSError * _Nullable error) {
      if (!error) {
          NSLog(@"add NotificationRequest succeeded!");
      }
  }];
  
}

- (void)applicationWillTerminate:(UIApplication *)application {
  
  [[NSNotificationCenter defaultCenter]
          postNotificationName:@"TestNotification"
          object:self];
}

- (void)registerForNotification {
    if (SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO(@"8.0")) {
        UIUserNotificationType types = UIUserNotificationTypeSound | UIUserNotificationTypeBadge | UIUserNotificationTypeAlert;
        UIUserNotificationSettings *notificationSettings = [UIUserNotificationSettings settingsForTypes:types categories:nil];
        [[UIApplication sharedApplication] registerUserNotificationSettings:notificationSettings];
    } else {
        [[UIApplication sharedApplication] registerForRemoteNotificationTypes:(UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeSound | UIRemoteNotificationTypeAlert)];
    }
}


//- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler{
//
//    UIApplicationState state = [[UIApplication sharedApplication] applicationState];
//    if (state == UIApplicationStateBackground || state == UIApplicationStateInactive)
//    {
//
//    }else{
//        completionHandler(UNNotificationPresentationOptionAlert);
//    }
//}

-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  completionHandler(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge);
}


- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler{

}

//- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
//{
//#if DEBUG
//  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
//#else
//  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
//#endif
//
//}

//- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
//{
//  return [RNBranch.branch application:app openURL:url options:options] || [[UIApplication sharedApplication] openURL:url];
////  return [RNBranch.branch application:app openURL:url options:options] || [[UIApplication sharedApplication] openURL:options:completionHandler::url];
//}
//- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
//{
//  return [RNBranch application:app openURL:url options:options];
//}
//
//- (BOOL)application:(UIApplication *)app continueUserActivity:(nonnull NSUserActivity *)userActivity restorationHandler:(nonnull void (^)(NSArray * _Nullable))restorationHandler
//{
//  return [RNBranch.branch continueUserActivity:userActivity];
//}



- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
    if ([RNBranch application:app openURL:url options:options])  {
        // do other deep link routing for the Facebook SDK, Pinterest SDK, etc
    }
  
  
  if ([[FBSDKApplicationDelegate sharedInstance] application:app openURL:url options:options]) {
     return YES;
   }

   if ([RCTLinkingManager application:app openURL:url options:options]) {
     return YES;
   }
    return YES;
}


- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler {
  return [RNBranch continueUserActivity:userActivity];
}


@end
