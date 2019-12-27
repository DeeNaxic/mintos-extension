<h3 align="center">
    <img src="src/icons/icon-128.png" width="150">
    <br>
    Investment Extensions: Mintos
</h3>

<p align="center">
    <a href="#Introduction">introduction</a>
    •
    <a href="#Transparency">transparency</a>
    •
    <a href="#Limitations" >limitations </a>
    •
    <a href="#Installation">installation</a>
    •
    <a href="#Contact"     >contact     </a>
</p>

---



### Introduction

This project aims to add a layer of information and functionality to the [Mintos](https://www.mintos.com) P2P investment website, through a [Chrome Extension](https://chrome.google.com/webstore/detail/investment-extensions-min/ehngchilahobaplambailiienioefiod?fbclid=IwAR01MI6zIVPmprXmABE3KDIEdpU7hW_b4cJrI0AwM2gpjFFrT-GuJx5qFxo). The project is driven by a group of computer scientists from the Copenhagen University of Computer Science (DIKU), who likes to work with investments. The extension was originally an internal tool we used, to fix visual and information gaps on the Mintos website, to improve our experience. From here it has grown and has now been fully released to the public. For a full feature list, please visit the [Chrome Extension Store page](https://chrome.google.com/webstore/detail/investment-extensions-min/ehngchilahobaplambailiienioefiod?fbclid=IwAR01MI6zIVPmprXmABE3KDIEdpU7hW_b4cJrI0AwM2gpjFFrT-GuJx5qFxo). Some key points about the extension are:

- The extension does add additional information to various pages.
- The extension does change the cosmetic of the website in a few places.
- The extension does allow for features to be turned on or off individually.
- The extension does run directly in your Chrome browser.
- The extension does provide full open-source code for transparency.

<br>



### Transparency

This GitHub repository is intended for our Chrome Extension (see above link for Chrome Store page) [release packages](https://github.com/DeeNaxic/mintos-extension/tree/master/bin), the [source](https://github.com/DeeNaxic/mintos-extension/tree/master/src) code from which it is compiled and a [collection](https://github.com/DeeNaxic/mintos-extension/issues) of features, bugs, and tasks currently in development. The repository itself is not intended for public use, but it does also serve as a way to provide an additional layer of transparency. Trust is an important aspect when it comes to investments, and we do encourage people to perform a full audit of our source code, or even download and run the unpacked extension locally. If you do not have the technical experience to perform such an audit, but still want to ensure that what you are running is not malicious, then feel free to send the repository to someone who does. The code is written in plain JavaScript with a small amount of CSS and HTML, and as so, should be fairly trivial to understand. The following are important aspects in regards to trust:

- The extension does not monetize in any way, it is entirely free.
- The extension does not automate or perform any action for you.
- The extension does not falsely alter any information displayed on the website.
- The extension does not store or send any information about you or your investments.
- The extension does not require any login or user information.

<br>



### Limitations

As this is a Chrome extension, it only runs in a Chrome Browser, and there is no plans to ever create a similar product for other browsers. For the same reason, this will not work on a mobile phone, so when viewing the website elsewhere, it will just look normal. The biggest limitation at the moment, is the translations. Currently we only provide the plugin for English, German and Polish. If you use the Mintos website in another language, and are able to help us translate a few lines - then please reach out to us.

<br>



### Installation

There are two ways to get this extension to work:

1. You can download it directly through the Chrome store page available [here](https://chrome.google.com/webstore/detail/investment-extensions-min/ehngchilahobaplambailiienioefiod?fbclid=IwAR01MI6zIVPmprXmABE3KDIEdpU7hW_b4cJrI0AwM2gpjFFrT-GuJx5qFxo). By using this method, you can use the built-in Chrome Extension installer, and it will add the extension directly to your browser, with no setup required. Doing it this way takes less time and you can get subsequent updates easier. After a page refresh, the extension should run.

2. If you prefer a more hands-on and higher transparency approach, you are more than welcome to perform a manual install from the source code. You can download the source code directly from this repository and perform a full audit. If you are satisfied you can then open Chrome to the [extensions page](chrome://extensions/) and load it in, as an unpacked extension. This way is a bit more difficult to setup, and disables automatic updates - but we did want to provide this method for better security.

<br>



### Contact

If you have any feedback, questions, suggestions or just want to reach out to us, you can throw us an e-mail at investment.extensions@gmail.com. If you have any kind of feature you would like us to add, feel free to contact us, or if you already have the technical expertise, then feel free to open a pull request with the changes, we do accept pull requests as long as they are well reasoned, and do not break with our principles for the extension.

<br>
