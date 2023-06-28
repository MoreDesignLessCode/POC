# P&G Flutter POC

A new Flutter project.


## Installation
1. Download and Install Flutter Sdk for your Operating System from [here](https://docs.flutter.dev/get-started/install)

2. Extract the zip file and place the contained flutter in the desired installation location for the Flutter SDK (for example, C:\src\flutter).

3. From the Start search bar, enter `env` and select Edit environment variables for your account

4. Under User variables check if there is an entry called Path, append the full path to flutter\bin using ; as a separator from existing values.

5. Once the above step is completed go to the folder where flutter is extracted and Open Command promt and enter `C:\src\flutter>flutter doctor`

6. Flutter doctor will check the validity of the sdk and shows the dependent modules that are needed for flutter to work.
 
#### Android Sdk Installation.

1. The flutter doctor will promt to download the Andoird Sdk to develop applications.

2. Download and Refer android SDK installation from [here](https://docs.flutter.dev/get-started/install/windows#install-android-studio)

3. Once sdk is installed install an emulator inside the SDK . [Refer this document](https://docs.flutter.dev/get-started/install/windows#set-up-the-android-emulator)

4. Run the flutter doctor again with `flutter doctor --android-licenses`

5. If flutter doctor shows any related to installation of Visual C++ and Visual Studio it is related to windows App developement which is not required for running the application and can skip that.

#### IDE Setup

1. We are using Visual Studio code as IDE for flutter applications. Download   and install [VS Code](https://code.visualstudio.com/).

2. Inside Vscode Go to extensions`Ctrl+Shift+X`and install Flutter and Dart extensions which will help in syntax highlighting.

#### Application Startup
1. Open the Project in Vs code.

2. On the bottm right of VS code you can  see Windows(windows -x64 ) or no Device. Please click on this to select the console on which the flutter app needs to run. If the android emulator is installed with the SDK we can  see that emulator from the list of devices.

3. Navigate to terminal and execute `flutter run`

4. You can see the app getting run on your selected emulator device

## Getting Started

This project is a starting point for a Flutter application.

A few resources to get you started if this is your first Flutter project:

- [Lab: Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Cookbook: Useful Flutter samples](https://docs.flutter.dev/cookbook)

For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.
