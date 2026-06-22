package com.fr8;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.marianhello.bgloc.react.BackgroundGeolocationPackage;
//import com.faizal.OtpVerify.RNOtpVerifyPackage;
import io.branch.rnbranch.RNBranchModule;
import me.furtado.smsretriever.RNSmsRetrieverPackage;
import com.burnweb.rnsendintent.RNSendIntentPackage;
import com.imagepicker.ImagePickerPackage;
import com.tkporter.sendsms.SendSMSPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import io.branch.rnbranch.RNBranchPackage;
// import io.radar.react.RNRadarPackage;

import com.facebook.react.modules.network.OkHttpClientProvider;
import com.facebook.react.shell.MainReactPackage;
import com.wix.reactnativenotifications.RNNotificationsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.RNFetchBlob.RNFetchBlobPackage;

// import io.radar.sdk.Radar;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          return packages;
        }
//          @Override
//          protected List<ReactPackage> getPackages() {
//              return Arrays.<ReactPackage>asList(
//                      new MainReactPackage(),
//            new BackgroundGeolocationPackage(),
//            new RNOtpVerifyPackage(),
//            new RNSmsRetrieverPackage(),
//            new RNSendIntentPackage(),
//            new ImagePickerPackage(),
//            new RNDeviceInfo(),
////            new RNBranchPackage(),
//            new RNBranchPackage(),
//                      new RNFirebaseMessagingPackage()
//
//              );
//          }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
      RNBranchModule.getAutoInstance(this);
//      SSLCertificateHandler.nuke();
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this); // Remove this line if you don't want Flipper enabled
  }

  /**
   * Loads Flipper in React Native templates.
   *
   * @param context
   */
  private static void initializeFlipper(Context context) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.facebook.flipper.ReactNativeFlipper");
        aClass.getMethod("initializeFlipper", Context.class).invoke(null, context);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
