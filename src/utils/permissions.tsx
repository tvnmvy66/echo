import { PermissionsAndroid } from 'react-native';
import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';

export const requestAllPermissions = async () => {
    try {
        const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        ]);

        if (granted["android.permission.ACCESS_FINE_LOCATION"] === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("✅ Location granted");

            const background = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
            );

            if (background === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("✅ Background location granted");
            } else {
                console.log("❌ Background location denied");
            }

        } else {
            console.log("❌ Location denied");
        }

        if (granted["android.permission.POST_NOTIFICATIONS"] === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("✅ Notifications granted");
        } else {
            console.log("❌ Notifications denied");
        }

    } catch (err) {
        console.warn(err);
    }
};

export const enableLocation = async () => {
    try {
        await promptForEnableLocationIfNeeded({
            interval: 10000,
        });
        return true;
    } catch {
        return false;
    }
};

