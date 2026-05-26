class analytics {
  constructor(key, secret) {
    if (GameAnalytics && gameanalytics) {
      GameAnalytics("setEnabledInfoLog", true);
      GameAnalytics("setEnabledVerboseLog", true);
      GameAnalytics("configureBuild", "0.1.0");
      GameAnalytics("initialize", key, secret);
      this.enabled = true;
    } else {
      // Analytics failed to set up
    }
  }

  submitEvent(name, number) {
    if (this.enabled) {
      gameanalytics.GameAnalytics.addDesignEvent(name, number);
    }
  }

  // GAObject.submitEvent('adComplete', 1)
}
