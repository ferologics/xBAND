package com.clean_project;

import android.content.Intent;
import android.os.Bundle;

import com.clean_project.usbclient.SerialActivity;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

// ExtraDimensions node module for calculation of android screen size
import ca.jaysoo.extradimensions.ExtraDimensionsPackage;  // <--- import


public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "clean_project";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new ExtraDimensionsPackage(this)  // <--- add here
        );
    }

//    @Override
//    public void onCreate(Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//
//        trySerial();
//    }

    private void trySerial() {
        Intent intent = new Intent(this, SerialActivity.class);
        startActivityForResult(intent, 0);
    }
}