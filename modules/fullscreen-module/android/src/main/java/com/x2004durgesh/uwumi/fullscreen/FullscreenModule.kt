package com.x2004durgesh.uwumi.fullscreen

import android.os.Build
import android.view.View
import android.view.WindowInsets
import android.view.WindowInsetsController
import android.view.WindowManager
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class FullscreenModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("FullscreenModule")

    Function("enterFullscreen") {
      val activity = appContext.currentActivity ?: return@Function false
      activity.runOnUiThread {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
          // For Android 11+ (API 30+)
          val controller = activity.window.insetsController
          if (controller != null) {
            // Hide both the status bar and the navigation bar
            controller.hide(WindowInsets.Type.statusBars() or WindowInsets.Type.navigationBars())
            controller.systemBarsBehavior =
                    WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
          }
          // Set navigation bar color to transparent
          activity.window.navigationBarColor = 0x00000000
          activity.window.statusBarColor = 0x00000000
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
          // For Android 9-10 (API 28-29)
          @Suppress("DEPRECATION")
          activity.window.attributes.layoutInDisplayCutoutMode =
                  WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES

          @Suppress("DEPRECATION")
          activity.window.decorView.systemUiVisibility =
                  (View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY or
                          View.SYSTEM_UI_FLAG_LAYOUT_STABLE or
                          View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or
                          View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN or
                          View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or
                          View.SYSTEM_UI_FLAG_FULLSCREEN)
          // Set navigation bar and status bar colors to transparent
          activity.window.navigationBarColor = 0x00000000
          activity.window.statusBarColor = 0x00000000
        } else {
          // Rest of code as before...
          // Also add here:
          activity.window.navigationBarColor = 0x00000000
          activity.window.statusBarColor = 0x00000000
        }
      }
      true
    }

    Function("exitFullscreen") {
      val activity = appContext.currentActivity ?: return@Function false
      activity.runOnUiThread {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
          // For Android 11+ (API 30+)
          val controller = activity.window.insetsController
          if (controller != null) {
            // Show both the status bar and the navigation bar
            controller.show(WindowInsets.Type.statusBars() or WindowInsets.Type.navigationBars())
          }
        } else {
          // For Android 10 and below (API 29-)
          @Suppress("DEPRECATION")
          activity.window.clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN)

          @Suppress("DEPRECATION")
          activity.window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_VISIBLE
        }
      }
      true
    }

    Function("isFullscreen") {
      val activity = appContext.currentActivity ?: return@Function false

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        // For Android 11+ (API 30+)
        val controller = activity.window.insetsController
        return@Function controller?.systemBarsBehavior ==
                WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
      } else {
        // For Android 10 and below (API 29-)
        @Suppress("DEPRECATION") val flags = activity.window.decorView.systemUiVisibility
        return@Function (flags and View.SYSTEM_UI_FLAG_FULLSCREEN) != 0
      }
    }
  }
}
