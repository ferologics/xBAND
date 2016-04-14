package com.clean_project.usbclient;

import android.os.Handler;
import android.os.Message;
import android.support.annotation.Nullable;
import android.util.Log;

import com.clean_project.MainActivity;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.lang.ref.WeakReference;


public class MyHandler extends Handler {

    private final WeakReference<MainActivity> mActivity;
    private ReactContext someContext;

    public MyHandler(MainActivity activity) {
        mActivity = new WeakReference<>(activity);
        someContext = mActivity.get().getContext();
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params)
    {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @Override
    public void handleMessage(Message msg) {

        switch (msg.what) {
            case UsbService.MESSAGE_FROM_SERIAL_PORT:

                String data = (String) msg.obj;
                Log.d(mActivity.getClass().getSimpleName(),data);

                // some of this might crash the app because the context is null
                WritableMap params = Arguments.createMap();
                params.putString("test", data);

                sendEvent(someContext, "message", params);

                break;
        }
    }
}
