//
//  ViewController.m
//  BBLocationManager
//
//  Created by Benzamin Basher on 1/29/17.
//  Copyright © 2017 Benzamin Basher. All rights reserved.
//
#import <UIKit/UIView.h>
#import "ViewController.h"
#import "AppDelegate.h"
#import "BBLocationManager.h"
#import <MapKit/MapKit.h>
#import <CoreLocation/CoreLocation.h>

@interface ViewController () <BBLocationManagerDelegate>

//use this if you want to get response from delegate not from block
@property(nonatomic, weak) IBOutlet UITextView *logTextView;
@property(nonatomic, weak) IBOutlet MKMapView *mapView;
@property(nonatomic, strong) MKPointAnnotation *annotation;
@property(nonatomic,strong) NSString *average;
@property(nonatomic,strong) NSString *myText;
@property(nonatomic,strong) NSString *myTextBody;
@property(nonatomic,strong) NSString *backgroundTaskID;
@end


@implementation ViewController

UIBackgroundTaskIdentifier bgTask;

RCT_EXPORT_MODULE();
//viewDidLoad is used to call the delegates
RCT_EXPORT_METHOD(viewDidLoad){
  
//    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    BBLocationManager *manager = [BBLocationManager sharedManager];
    manager.delegate = self; //not mandatory here, just to get the delegate calls

    [self.mapView setTranslatesAutoresizingMaskIntoConstraints:NO];
    self.mapView.layer.cornerRadius = 6.0f;
    self.annotation = [[MKPointAnnotation alloc] init];


}

//get the Location on loading the app
//- (void)viewWillAppear:(BOOL)animated
//RCT_EXPORT_METHOD(viewWillAppear)
//{
//    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(2.0 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//        [self getLocationOnLoad];
//    });
//
//}


//-(IBAction)showAllGeoFences:(id)sender
   RCT_EXPORT_METHOD(showAllGeoFences)

{
   
    CLLocationManager *locationManager = [[CLLocationManager alloc] init];
    [locationManager requestAlwaysAuthorization];
    BBLocationManager *manager = [BBLocationManager sharedManager];
    
    NSArray *geoFences = [manager getCurrentFences];
    NSString *allFencetxt = @"All fences: ";
    for (BBFenceInfo *geofence in geoFences)
    {
        NSString *txt = [NSString stringWithFormat:@"Geofence '%@' is Active at Coordinates: %@:%@ with %@ meter radious \n", geofence.fenceIDentifier, [geofence.fenceCoordinate objectForKey:BB_LATITUDE],[geofence.fenceCoordinate objectForKey:BB_LONGITUDE], [geofence.fenceCoordinate objectForKey:BB_RADIOUS]];
        NSLog(@"%@", txt);
        allFencetxt = [allFencetxt stringByAppendingString:txt];
      
    }
    [self logtext:allFencetxt];
    if(geoFences.count == 0) [self logtext:@"No Geofence is added currently"];
}
  //to add the fences add the cordinates of location with name
//-(IBAction)addFenceGeoatCurrentLocation:(id)sender
//RCT_EXPORT_METHOD(addFenceGeoatCurrentLocation)
RCT_EXPORT_METHOD(addFenceGeoatCurrentLocation:(NSString *)name latitude:(NSString *)latitude logitude:(NSString *)logitude radius:(NSString *)radius id: (NSString *)id )
{
  double letitudeeDouble=[latitude doubleValue];
  NSLog(@"letData %@ %@ %@",latitude,name,id);
  double longitudeDouble=[logitude doubleValue];
  
  int radiusData=[radius intValue];
  
//  [eventData setBridge:rootBridge];
//  [eventData doMyAction];
    BBLocationManager *manager = [BBLocationManager sharedManager];
    manager.delegate = self;
    [manager addGeofenceAtCurrentLocationWithRadious:1];
 

  CLLocation *location18=[[CLLocation alloc]
                         initWithLatitude:letitudeeDouble longitude:longitudeDouble];
  [manager addGeofenceAtLocation:location18 withRadious:radiusData withIdentifier:name ];
  

}
//to remove the all geoFences
//-(IBAction)removeAllGeofence:(id)sender
RCT_EXPORT_METHOD(removeAllGeofence)
{
    BBLocationManager *manager = [BBLocationManager sharedManager];
    
    NSArray *geoFences = [manager getCurrentFences];
  NSLog(@"array ==%@",geoFences);
    for (BBFenceInfo *geofence in geoFences)
    {
        [manager deleteGeoFenceWithIdentifier:geofence.fenceIDentifier];
    }
    [self logtext:@"All Geofences deleted!"];
}

//-(IBAction)getCurrentLocation:(id)sender
RCT_EXPORT_METHOD(getCurrentLocation)
{
     BBLocationManager *manager = [BBLocationManager sharedManager];
     [manager getCurrentLocationWithCompletion:^(BOOL success, NSDictionary *latLongAltitudeDictionary, NSError *error) {

         [self logtext:[NSString stringWithFormat:@"Current Location: %@", latLongAltitudeDictionary.description]];
         [self showInMapsWithDictionary:latLongAltitudeDictionary title:@"Current Location"];
     }];

}



//-(void)getLocationOnLoad
RCT_EXPORT_METHOD(getLocationOnLoad)
{
  
    BBLocationManager *manager = [BBLocationManager sharedManager];
    [manager getCurrentLocationWithCompletion:^(BOOL success, NSDictionary *latLongAltitudeDictionary, NSError *error) {
   
        [self logtext:[NSString stringWithFormat:@"Current Location: %@", latLongAltitudeDictionary.description]];
        [self showInMapsWithDictionary:latLongAltitudeDictionary title:@"Current Location"];
      NSLog(@"onLoad==%@",latLongAltitudeDictionary.description);
    }];
  
}

//-(IBAction)getCurrentGeoCodeAddress:(id)sender
RCT_EXPORT_METHOD(getCurrentGeoCodeAddress)
{
    
    BBLocationManager *manager = [BBLocationManager sharedManager];
    [manager getCurrentGeoCodeAddressWithCompletion:^(BOOL success, NSDictionary *addressDictionary, NSError *error) {
        //access the dict using BB_LATITUDE, BB_LONGITUDE, BB_ALTITUDE
        [self logtext:[NSString stringWithFormat:@"Current Location GeoCode/Address: %@", addressDictionary.description]];
        [self showInMapsWithDictionary:addressDictionary title:@"Geocode/Address"];
    }];
    //[manager getCurrentLocationWithDelegate:self]; //can be used
}

//-(IBAction)getContiniousLocation:(id)sender
RCT_EXPORT_METHOD(methodgetContiniousLocation)
{
    BBLocationManager *manager = [BBLocationManager sharedManager];
    [manager getContiniousLocationWithDelegate:self];
}

//-(IBAction)getSignificantLocationChange:(id)sender
RCT_EXPORT_METHOD(getSignificantLocationChange)
{
    BBLocationManager *manager = [BBLocationManager sharedManager];
    [manager getSingificantLocationChangeWithDelegate:self];
}

//-(IBAction)stopGettingLocation
RCT_EXPORT_METHOD(stopGettingLocation)
{
    BBLocationManager *manager = [BBLocationManager sharedManager];
    [manager stopGettingLocation];
}



//-(void)showInMapsWithDictionary:(NSDictionary*)locationDict title:(NSString*)title
RCT_EXPORT_METHOD(showInMapsWithDictionary:(NSDictionary *)locationDict title:(NSString *)title)
{
    CLLocationCoordinate2D infiniteLoopCoordinate = CLLocationCoordinate2DMake([locationDict[BB_LATITUDE] floatValue], [locationDict[BB_LONGITUDE] floatValue]);
    
    [self.annotation setCoordinate:infiniteLoopCoordinate];
    [self.annotation setTitle:title];;
    [self.mapView addAnnotation:self.annotation];
    
    self.mapView.region = MKCoordinateRegionMakeWithDistance(infiniteLoopCoordinate, 3000.0f, 3000.0f);

}

RCT_EXPORT_METHOD(setAverageTime:(nonnull NSNumber *)average){
  NSLog(@"%@ ddd",average);
  self.average=average;
}


-(void)logtext:(NSString*)text
{
    self.logTextView.text = text;
}


-(void)startLocationServices {
  CLLocationManager *locationManager;
  [locationManager startUpdatingLocation];
     [locationManager stopUpdatingLocation];
}



//is used to call the all delgates
- (dispatch_queue_t)methodQueue
{
  
  return dispatch_get_main_queue();

}

//supportedEvents is used to access the all Data with events with calleventDelegates key value
- (NSArray<NSString *> *)supportedEvents {
  return @[@"calleventDelegates"];
}



RCT_EXPORT_METHOD(notificationText:(NSString *)text textBody:(NSString *)textBody )
{
  NSLog(@"callllllllllllllll==%@",text);
  self.myText=text;
  self.myTextBody=textBody;
  NSDictionary* userInfo = @{@"myText": (text),@"myTextBody":(textBody)};
//  NSDictionary* userInfo = @{@"myTextBody": (textBody)};
  NSNotificationCenter* nc = [NSNotificationCenter defaultCenter];
  [nc postNotificationName:@"TestNotifications" object:self userInfo:userInfo];
}







#pragma mark - BBLocationManagerDelegate

-(void)BBLocationManagerDidAddFence:(BBFenceInfo *)fenceInfo
//RCT_EXPORT_METHOD(BBLocationManagerDidAddFence:(BBFenceInfo *)fenceInfo)
{
  
//  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(12.0 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//  
//    NSDate * now = [NSDate date];
//    NSDateFormatter *outputFormatter = [[NSDateFormatter alloc] init];
//    [outputFormatter setDateFormat:@"HH:mm:ss"];
//    NSString *newDateString = [outputFormatter stringFromDate:now];
//    NSLog(@"newDateString %@", newDateString);
//    
//    [self showLocalNotificationExit:[NSString stringWithFormat:@"%@", newDateString] withDate:[NSDate dateWithTimeIntervalSinceNow:1]];
//  });
  
    NSString *text = [NSString stringWithFormat:@"Added GeoFence: %@", fenceInfo.dictionary.description];
    NSLog(@"%@", text);
    [self logtext:text];
    [self showInMapsWithDictionary:fenceInfo.fenceCoordinate title:@"Added GeoFence"];
}

-(void)BBLocationManagerDidFailedFence:(BBFenceInfo *)fenceInfo
//RCT_EXPORT_METHOD(BBLocationManagerDidFailedFence:(BBFenceInfo *)fenceInfo)
{
    NSString *text = [NSString stringWithFormat:@"Failed to add GeoFence: %@", fenceInfo.dictionary.description];
    NSLog(@"%@", text);
    [self logtext:text];
    [self showInMapsWithDictionary:fenceInfo.fenceCoordinate title:@"Failed GeoFence"];
}

-(void)sendDataToServer:( NSData *)data {
  
  dispatch_async(dispatch_get_main_queue(), ^{
    
    [self showLocalNotificationEnter:[NSString stringWithFormat:@"%@", @"text dispatch queue"] withDate:[NSDate dateWithTimeIntervalSinceNow:1]];
//    self.backgroundTaskID = UIApplication.shared.beginBackgroundTask (withName: "Finish Network Tasks") {
//       // End the task if time expires.
//       UIApplication.shared.endBackgroundTask(self.backgroundTaskID!)
//       self.backgroundTaskID = UIBackgroundTaskInvalid
//    }
//
//    // Send the data synchronously.
//    self.sendAppDataToServer( data: data)
//
//    // End the task assertion.
//    UIApplication.shared.endBackgroundTask(self.backgroundTaskID!)
//    self.backgroundTaskID = UIBackgroundTaskInvalid
//
//     // do work here to Usually to update the User Interface
//  });
      
  });
}


-(void)BBLocationManagerDidEnterFence:(BBFenceInfo *)fenceInfo
//RCT_EXPORT_METHOD(BBLocationManagerDidEnterFence:(BBFenceInfo *)fenceInfo)
{
  
  UIApplication  *app = [UIApplication sharedApplication];
  bgTask = [app beginBackgroundTaskWithExpirationHandler:^{
      [app endBackgroundTask:bgTask];
  }];
  self.silenceTimer = [NSTimer scheduledTimerWithTimeInterval:300 target:self
  selector:@selector(startLocationServices) userInfo:nil repeats:YES];

  [self sendEventWithName:@"calleventDelegates" body:fenceInfo.dictionary];
    
//    [self showLocalNotificationEnter:[NSString stringWithFormat:@"%@", text] withDate:[NSDate dateWithTimeIntervalSinceNow:1]];
    [self showInMapsWithDictionary:fenceInfo.fenceCoordinate title:@"Enter GeoFence"];
  
}


-(void)BBLocationManagerDidExitFence:(BBFenceInfo *)fenceInfo
//RCT_EXPORT_METHOD(BBLocationManagerDidExitFence:(BBFenceInfo *)fenceInfo)
{
  
  UIApplication  *app = [UIApplication sharedApplication];
  bgTask = [app beginBackgroundTaskWithExpirationHandler:^{
      [app endBackgroundTask:bgTask];
  }];
  self.silenceTimer = [NSTimer scheduledTimerWithTimeInterval:300 target:self
  selector:@selector(startLocationServices) userInfo:nil repeats:YES];
   [self sendEventWithName:@"calleventDelegates" body:fenceInfo.dictionary];
//  NSNumber *myDoubleNumber = [NSNumber numberWithDouble:fenceInfo.eventTimeStamp.doubleValue];
//  NSString *text1 =[NSString stringWithFormat:@"Exit GeoFence: %@", [fenceInfo.dictionary objectForKey:BB_FENCE_IDENTIFIER_KEY]];
//  NSDate *date=[NSDate dateWithTimeIntervalSince1970:fenceInfo.eventTimeStamp.doubleValue];
//  NSDateFormatter *formatter = [NSDateFormatter new];
//  formatter.dateFormat = @"dd-MM-yyyy";
//  NSString *formattedDate = [formatter stringFromDate:date];
//  NSArray *myWords = [text1 componentsSeparatedByString:@","];
//    NSString *text =[NSString stringWithFormat:@"Exit GeoFence: %@", [fenceInfo.dictionary objectForKey:BB_FENCE_IDENTIFIER_KEY]];
//  NSString * text2 = [NSString stringWithFormat: @"Thank you for visiting %@", myWords[1]];
//  NSString * text2 = [NSString stringWithFormat: @"You’ve left %@", myWords[1]];
//  NSString * texts = [text2 stringByAppendingString:@". Estimated Time waiting: "];
//  NSString *textAdded=[texts stringByAppendingFormat:@"%@",self.average ];
////  NSString * text = text2 +  @"Come back Again! %@" ;
//  NSString * text = [textAdded stringByAppendingString:@" Minutes."];
////  NSString *text = myWords[1];
//    NSLog(@"Exit==%@", text);
//    [self logtext:text];
//    [self showLocalNotificationExit:[NSString stringWithFormat:@"%@", text] withDate:[NSDate dateWithTimeIntervalSinceNow:1]];
    [self showInMapsWithDictionary:fenceInfo.fenceCoordinate title:@"Exit GeoFence"];
 

}


-(void)BBLocationManagerDidUpdateLocation:(NSDictionary *)latLongAltitudeDictionary
//RCT_EXPORT_METHOD(BBLocationManagerDidUpdateLocation:(NSDictionary *)latLongAltitudeDictionary)
{
    NSLog(@"Current Location: %@", latLongAltitudeDictionary.description);
    [self logtext:[NSString stringWithFormat:@"Current Location: %@ at time: %@", latLongAltitudeDictionary.description, NSDate.date.description]];
    [self showInMapsWithDictionary:latLongAltitudeDictionary title:@"Current Location"];
  
//  [self sendEventWithName:@"calleventDelegates" body:latLongAltitudeDictionary];
}


-(void)BBLocationManagerDidUpdateGeocodeAdress:(NSDictionary *)addressDictionary
//RCT_EXPORT_METHOD(BBLocationManagerDidUpdateGeocodeAdress:(NSDictionary *)addressDictionary)
{
     NSLog(@"Current Location GeoCode/Address: %@", addressDictionary.description);
    [self logtext:[NSString stringWithFormat:@"Current Location: %@ at time: %@", addressDictionary.description, NSDate.date.description]];
    [self showInMapsWithDictionary:addressDictionary title:@"Geocode Updated"];
}

#pragma mark-  Other methods




-(void)showLocalNotificationEnter:(NSString*)notificationBody withDate:(NSDate*)notificationDate
//RCT_EXPORT_METHOD(showLocalNotification:(NSString *)notificationBody withDate:(NSDate*)notificationDate)
{
//  NSLog(notificationBody);
  
 

    UIApplication *app                = [UIApplication sharedApplication];
    UILocalNotification *notification = [[UILocalNotification alloc] init];
    
    notification.fireDate  = notificationDate;
    notification.timeZone  = [NSTimeZone defaultTimeZone];
    notification.alertBody = notificationBody;
    notification.soundName = UILocalNotificationDefaultSoundName;
    //notification.applicationIconBadgeNumber = badgeCount;
    
    NSMutableDictionary *userInfo = [NSMutableDictionary dictionary];
    //[userInfo setValue:eventType forKey:@"event_type"];
    [notification setUserInfo:userInfo];
    [app scheduleLocalNotification:notification];

}

-(void)showLocalNotificationExit:(NSString*)notificationBody withDate:(NSDate*)notificationDate
//RCT_EXPORT_METHOD(showLocalNotification:(NSString *)notificationBody withDate:(NSDate*)notificationDate)
{
//  NSLog(notificationBody);
    UIApplication *app                = [UIApplication sharedApplication];
    UILocalNotification *notification = [[UILocalNotification alloc] init];
    
    notification.fireDate  = notificationDate;
    notification.timeZone  = [NSTimeZone defaultTimeZone];
    notification.alertBody = notificationBody;
//  NSString* documentsPath =
//  [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
//  NSString *path = [NSString stringWithFormat:@"%@/DingDongTone.wav",documentsPath];
//  NSString *path = [NSString stringWithFormat:@"%@/just-saying.wav",documentsPath];
  notification.soundName = @"update_type1.wav";
    //notification.applicationIconBadgeNumber = badgeCount;
    
    NSMutableDictionary *userInfo = [NSMutableDictionary dictionary];
    //[userInfo setValue:eventType forKey:@"event_type"];
    [notification setUserInfo:userInfo];
    [app scheduleLocalNotification:notification];

}



//- (void)didReceiveMemoryWarning {
//    [super didReceiveMemoryWarning];
//    // Dispose of any resources that can be recreated.
//}




@end
