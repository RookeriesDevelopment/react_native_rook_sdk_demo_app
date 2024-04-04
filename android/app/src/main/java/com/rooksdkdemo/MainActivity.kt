package com.rooksdkdemo

import android.os.Build
import android.os.Bundle;
import androidx.lifecycle.Lifecycle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.rookmotion.rook.sdk.domain.enums.SyncInstruction
import com.rookmotion.rook.sdk.domain.environment.RookEnvironment
import com.rookmotion.rook.sdk.framework.delegate.rookYesterdaySync


class MainActivity : ReactActivity() {

  val rookYesterdaySync by rookYesterdaySync(
    enableLogs = true,
    clientUUID = Credentials.uuid,
    secretKey = Credentials.pdw,
    environment = RookEnvironment.SANDBOX,
    state = Lifecycle.State.CREATED,
    doOnEnd = SyncInstruction.SYNC_LATEST,
  )

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "RookSdkDemo"

  override fun onCreate(savedInstanceState: Bundle?) {
    println("On create")

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      println("pase el if")
      rookYesterdaySync.enable(this)
    }
    
    super.onCreate(null)
  }

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
