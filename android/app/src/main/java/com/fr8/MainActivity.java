package com.fr8;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.TaskStackBuilder;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.media.AudioAttributes;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.PersistableBundle;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.datatheorem.android.trustkit.TrustKit;
import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.modules.network.OkHttpClientProvider;
import com.google.android.gms.security.ProviderInstaller;
import com.tkporter.sendsms.SendSMSPackage;

import java.net.HttpURLConnection;
import java.net.URLConnection;
import java.security.NoSuchAlgorithmException;

import org.devio.rn.splashscreen.SplashScreen;

import javax.net.ssl.SSLContext;

import io.branch.rnbranch.RNBranchModule;
//import kotlin.random.Random;

public class MainActivity extends ReactActivity {
  public  boolean  isOnNewIntent = false;

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    //probably some other stuff here
    SendSMSPackage.getInstance().onActivityResult(requestCode, resultCode, data);
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      NotificationChannel notificationChannel = new NotificationChannel("fr8", "fr8", NotificationManager.IMPORTANCE_HIGH);
      notificationChannel.setShowBadge(true);
      notificationChannel.setDescription("");
      AudioAttributes att = new AudioAttributes.Builder()
              .setUsage(AudioAttributes.USAGE_NOTIFICATION)
              .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
              .build();
      notificationChannel.setSound(Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/raw/update_type1"), att);
      notificationChannel.enableVibration(true);
      notificationChannel.setVibrationPattern(new long[]{400, 400});
      notificationChannel.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);
      NotificationManager manager = getSystemService(NotificationManager.class);
      manager.createNotificationChannel(notificationChannel);
    }


//    SplashScreen.show(this);  // here
    SplashScreen.show(this, R.style.SplashScreenTheme,true);  // here



      try {
        SSLContext.getInstance("TLSv1.2");
      } catch (Exception e) {
        e.printStackTrace();
      }

      try {
        ProviderInstaller.installIfNeeded(getApplicationContext());
      } catch (Exception e) {
        e.printStackTrace();
      }


    try {
      TrustKit.initializeWithNetworkSecurityConfiguration(this);
    } catch (Exception e) {
      e.printStackTrace();
    }
//    SSLCertificateHandler.nuke();
    OkHttpClientProvider.setOkHttpClientFactory(new CustomClientFactory());
    super.onCreate(null);
  }
    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        RNBranchModule.onNewIntent(intent);
      isOnNewIntent = true;
      ForegroundEmitter();
    }
  @Override
  protected String getMainComponentName() {
    return "FR8";
  }

  @Override
  protected void onStart() {

    RNBranchModule.initSession(getIntent().getData(), this);
    super.onStart();
    if(isOnNewIntent == true){}else {
      ForegroundEmitter();
    }
  }
  public  void  ForegroundEmitter(){
// this method is to send back data from java to javascript so one can easily
// know which button from notification or the notification button is clicked
    String  main = getIntent().getStringExtra("mainOnPress");
    String  btn = getIntent().getStringExtra("buttonOnPress");
    WritableMap map = Arguments.createMap();
    if (main != null) {
      map.putString("main", main);
    }
    if (btn != null) {
      map.putString("button", btn);
    }
    try {
      getReactInstanceManager().getCurrentReactContext()
              .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
              .emit("notificationClickHandle", map);
    } catch (Exception  e) {
      Log.e("SuperLog", "Caught Exception: " + e.getMessage());
    }
  }
        }
