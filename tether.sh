#!/bin/bash

set -eu

adb shell input keyevent KEYCODE_HOME

# open notification drawer
adb shell input swipe 100 0 100 500

# move to actions
adb shell input swipe 800 200 10 200

# move action list up
adb shell input swipe 200 800 200 100

adb shell input tap 900 1200

