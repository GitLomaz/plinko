class analytics {
  constructor(key, secret) {
    if (GameAnalytics && gameanalytics) {
      GameAnalytics("setEnabledInfoLog", true);
      GameAnalytics("setEnabledVerboseLog", true);
      GameAnalytics("configureBuild", "0.1.0");
      GameAnalytics("initialize", key, secret);
      this.enabled = true;
    } else {
      console.log("something not right, analytics failed to set up.");
    }
  }

  submitEvent(name, number) {
    if (this.enabled) {
      console.log("submitting metric: " + name);
      gameanalytics.GameAnalytics.addDesignEvent(name, number);
    }
  }

  // GAObject.submitEvent('adComplete', 1)
}
