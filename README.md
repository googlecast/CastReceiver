# CastReceiver

This sample shows how to develop a fully Cast Design Checklist compliant receiver with additional features.

**This is a reference receiver app to be used as the starting point for your custom receiver**

[List of reference apps and tutorials](https://developers.google.com/cast/docs/downloads)

## Setup Instructions
1. [Set up your Google Cast devices](https://developers.google.com/cast/docs/developers#setup_for_development) using steps 1-3 depending on the device type.
1. Host your Web Receiver app so that it is accessible using HTTPS.
1. [Register your Web Receiver](https://developers.google.com/cast/docs/registration#register_your_application) as a Custom Receiver on the [Google Cast SDK Developer Console](https://cast.google.com/publish).
    1. Enter your app name, URL to load when your app is launched, if it supports Guest Mode, and if casting to audio only devices is supported.
    1. Add your Android TV app package name if Cast Connect is supported.
    1. Add at least one sender under "Sender Details".
    1. Optionally, list your Web Receiver so it can be used with [Intent to Join](https://developers.google.com/cast/docs/android_sender/intent_to_join#google_cast_developer_console_setup) and can be discovered by users.
1. Once your app is ready, you will need to publish your app to allow all users to have access to your app. Until then, you can skip publishing to restrict the app to only devices listed in the [Cast SDK Developer Console](https://cast.google.com/publish/#/overview).
1. Check to make sure all of your devices are listed in the developer console under "Cast Receiver Devices". If a device is not listed, [find your test device serial number](https://developers.google.com/cast/docs/registration#find_device_serial_number) and [register your device in the developer console](https://developers.google.com/cast/docs/registration#devices).
1. Restart your test devices so they can discover your receiver.
1. Now that your receiver is set up, enter the Web Receiver App ID into your sender application or one of our reference sender applications listed above.
1. You should now be able to launch your receiver using a sender. Note that it may take up to 15 minutes for all of the above changes to propage through the system.
1. If you wish to watch what's going on in the receiver, use the [Chrome Remote Debugger](https://developers.google.com/cast/docs/debugging#chrome).

## Documentation
* [Google Cast Receiver Overview](https://developers.google.com/cast/docs/caf_receiver/)
* [Developer Guides](https://developers.google.com/cast/docs/developers)

## References
* [Receiver Reference](https://developers.google.com/cast/docs/reference/caf_receiver/)
* [Design Checklist](http://developers.google.com/cast/docs/design_checklist)

## How to report bugs
* [Google Cast SDK Support](https://developers.google.com/cast/support)
* For sample app issues, open an issue on this GitHub repo.

## Contributions
Please read and follow the steps in the [CONTRIBUTING.md](CONTRIBUTING.md).

## License
See [LICENSE](LICENSE).

## Terms
Your use of this sample is subject to, and by using or downloading the sample files you agree to comply with, the [Google APIs Terms of Service](https://developers.google.com/terms/) and the [Google Cast SDK Additional Developer Terms of Service](https://developers.google.com/cast/docs/terms/).
