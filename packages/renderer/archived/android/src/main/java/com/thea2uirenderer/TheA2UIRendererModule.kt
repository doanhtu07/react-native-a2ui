package com.thea2uirenderer

import com.facebook.react.bridge.ReactApplicationContext

class TheA2UIRendererModule(reactContext: ReactApplicationContext) :
  NativeTheA2UIRendererSpec(reactContext) {

  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }

  companion object {
    const val NAME = NativeTheA2UIRendererSpec.NAME
  }
}
