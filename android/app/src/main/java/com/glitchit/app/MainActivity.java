package com.glitchit.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.plugins.Camera;
import com.getcapacitor.plugins.Filesystem;
import com.getcapacitor.plugins.Geolocation;
import com.getcapacitor.plugins.Haptics;
import com.getcapacitor.plugins.Keyboard;
import com.getcapacitor.plugins.LocalNotifications;
import com.getcapacitor.plugins.Motion;
import com.getcapacitor.plugins.Preferences;
import com.getcapacitor.plugins.ScreenReader;
import com.getcapacitor.plugins.Share;
import com.getcapacitor.plugins.SplashScreen;
import com.getcapacitor.plugins.StatusBar;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Register all Capacitor plugins
        this.bridge.registerPlugin(new Camera());
        this.bridge.registerPlugin(new Filesystem());
        this.bridge.registerPlugin(new Geolocation());
        this.bridge.registerPlugin(new Haptics());
        this.bridge.registerPlugin(new Keyboard());
        this.bridge.registerPlugin(new LocalNotifications());
        this.bridge.registerPlugin(new Motion());
        this.bridge.registerPlugin(new Preferences());
        this.bridge.registerPlugin(new ScreenReader());
        this.bridge.registerPlugin(new Share());
        this.bridge.registerPlugin(new SplashScreen());
        this.bridge.registerPlugin(new StatusBar());

        super.onCreate(savedInstanceState);
    }
}
