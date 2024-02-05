# Code Time Limiter for Visual Studio Code

Code Time Limiter is an extension for Visual Studio Code designed to help manage your coding time effectively. It allows you to set a specific time limit for coding, after which it will automatically apply lint errors to all open editors to gently remind you that your designated coding time is over. This tool is perfect for managing time spent on projects, enforcing breaks, or limiting coding time to ensure work-life balance.

## Features

- **Set a Time Limit:** Easily select a future time to stop coding directly within VSCode.
- **Automatic Notifications:** Receive a warning 5 minutes before your coding time ends.
- **Immediate Feedback:** Once the time limit is reached, all open text documents will display lint errors indicating that coding time is over.
- **Toggle Activation:** Quickly activate or deactivate the time limit directly from the status bar.

## How to Use

1. **Activate the Time Limiter:** Click on the Code Time Limiter status bar item or use the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS) to toggle the time limiter.
2. **Set Your Time Limit:** Choose the hour and minute you wish to stop coding. A 5-minute warning and final message will alert you when it's time to take a break or stop coding.
3. **Deactivate:** You can deactivate the time limiter at any time through the status bar item or command palette.

## Installation

Install Code Time Limiter from the Visual Studio Code Marketplace or by searching for "Code Time Limiter" in the Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X` on macOS).

## Commands

- `codeTimeLimiter.toggleActivate`: Toggle the activation of the time limiter. This can be done via the command palette or by clicking the status bar item.

## Requirements

Visual Studio Code 1.86.0 or higher.

## Known Issues

Currently, lint errors applied to indicate the end of coding time are not automatically cleared when the time limit is deactivated. You will need to manually clear the lint errors or restart VSCode.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues to improve the extension.

## License

This project is licensed under the [AGPL-3.0](https://opensource.org/licenses/AGPL-3.0). Its use, modification, and distribution are allowed under the terms of this license.
