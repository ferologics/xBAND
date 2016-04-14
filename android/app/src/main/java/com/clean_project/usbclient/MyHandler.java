package com.clean_project.usbclient;

import android.os.Handler;
import android.os.Message;
import android.support.annotation.Nullable;
import android.util.Log;

import com.clean_project.MainActivity;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.lang.ref.WeakReference;


public class MyHandler extends Handler {

    private final WeakReference<MainActivity> mActivity;
    private ReactContext someContext;
    private String buffer = "";

    public MyHandler(MainActivity activity) {
        mActivity = new WeakReference<MainActivity>(activity);
        someContext = activity.getContext();
    }

    private void sendEvent(String eventName,
                           @Nullable WritableMap params)
    {
        mActivity.get().getContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @Override
    public void handleMessage(Message msg) {

        switch (msg.what) {
            case UsbService.MESSAGE_FROM_SERIAL_PORT:

                String data = (String) msg.obj;

                // some of this might crash the app because the context is null
                buffer += data;
                if( data.contains("\n") && buffer.length() > 1) {
                    WritableMap params = Arguments.createMap();
                    Log.d(mActivity.get().getClass().getSimpleName(),buffer);
                    params.putString("content", buffer);
                    sendEvent("message", params);
                    buffer = "";
                }

                break;
        }
    }
}
