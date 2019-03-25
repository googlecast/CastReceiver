# CastReceiver

This sample shows how to develop a fully Cast Design Checklist compliant receiver with additional features.

**This is a reference receiver app to be used as the starting point for your custom receiver**

[List of reference apps and tutorials](https://developers.google.com/cast/docs/downloads)

## Setup Instructions
1. Get a Google Cast device and get it set up for development: https://developers.google.com/cast/docs/developers#setup_for_development.
1. Upload the project to a website that can be accessed from your Chromecast. Later, when you publish your application, you will need to host so that it is accessible using HTTPS.
1. Register an application on the [Google Cast SDK Developer Console](https://cast.google.com/publish). Enter the URL for the player.html. There is a button marked publish, if
  you set that, then your receiver can be accessed by all devices, but it requires that you be serving using https.  Not publishing your app, lets you restrict the receiver to
  devices that you specify and allows you to host on most development servers.
1. If you haven't already done so, please register the serial # of your Google Cast device in the developer console as well.
1. Using the Chromecast setup application, make sure [x] send your serial number to Google is checked.  This is the only way that you can access your unpublished receiver.
  While you are in the Setup application, make a note of the IP address of your Chromecast. It will be helpful later if you wish to use the Chrome Remote Debugger.
1. 15 minutes after you have updated the developers console, you should reboot your Chromecast, so that it picks up the changes.
1. Enter the App ID of your receiver application into your sender application or one of our sample sender applications listed above.
1. You should now be able to launch your receiver using a sender.
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
