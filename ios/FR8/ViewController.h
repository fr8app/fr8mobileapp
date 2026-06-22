//
//  ViewController.h
//  BBLocationManager
//
//  Created by Benzamin Basher on 1/29/17.
//  Copyright © 2017 Benzamin Basher. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTBridge.h>
#import <React/RCTViewManager.h>
#import <React/RCTEventEmitter.h>

//@interface ViewController : NSObject <RCTBridgeModule>
@interface ViewController : RCTEventEmitter <RCTBridgeModule>

@property (nonatomic, retain) NSTimer *silenceTimer;
//@property (nonatomic, copy) RCTDirectEventBlock onEnter;
@end


