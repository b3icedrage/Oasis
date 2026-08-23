package com.glitchit.app;

import android.app.Application;
import android.os.StrictMode;

public class GlitchItApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();

        // Enable strict mode in debug for better error reporting
        if (BuildConfig.DEBUG) {
            StrictMode.setThreadPolicy(
                new StrictMode.ThreadPolicy.Builder()
                    .detectAll()
                    .penaltyLog()
                    .build()
            );
            StrictMode.setVmPolicy(
                new StrictMode.VmPolicy.Builder()
                    .detectLeakedSqlLiteObjects()
                    .detectLeakedClosableObjects()
                    .penaltyLog()
                    .build()
            );
        }
    }
}
