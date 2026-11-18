# MR Star Web Remote

Control Findn MR Star and Miracles Star LED strips directly from a browser over Bluetooth Low Energy. The Ukrainian-language remote includes power, color presets and custom HEX colors, brightness, animated previews, built-in scenes with speed and direction, and sound modes.

![MR Star Web Remote with the LED strip preview and controls for power, color, effects, and sound](docs/preview.png)

## Connect a strip

1. Open the remote in desktop Chrome or Edge on HTTPS or `localhost` and turn on Bluetooth.
2. Power on the strip and close the MR Star phone app to free the Bluetooth connection.
3. Click **Під’єднати** and choose the controller. It may appear as `GATT--DEMO`, `MRSTAR`, or `MR Star`.

Color and scene previews also work before connecting. Sound modes require a controller with a built-in microphone. [Web Bluetooth browser support](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API#browser_compatibility)

## Run locally

Use Node.js 24 LTS and npm. Open the localhost URL printed by the development server.

```sh
npm ci
npm run dev
```

```sh
npm run build    # Build the static site into dist/
npm run preview  # Serve the production build locally
```

## Publish to GitHub Pages

For a new public repository, run the following from a committed local checkout using the GitHub CLI. [GitHub CLI reference](https://cli.github.com/manual/gh_repo_create)

```sh
gh auth login
gh repo create mr-star-web-remote --public --source . --remote origin --push \
  --description "Browser-based Bluetooth remote for MR Star and Miracles Star LED strips."
```

1. In the GitHub repository, open **Settings → Pages** and set **Source** to **GitHub Actions**. [GitHub Pages deployment guide](https://docs.github.com/en/get-started/start-your-journey/deploying-your-website-automatically)
2. Open **Actions**, choose **Deploy to GitHub Pages**, and run it on `main`. The completed deploy job shows the site URL.

Later pushes to `main` deploy automatically. The workflow builds `dist/` with relative asset URLs, so the site works at `https://<owner>.github.io/mr-star-web-remote/` and at the root of a custom domain.

## Credits

- Bluetooth command format and scene IDs come from the MR-Star-OpenRGB project. [Protocol notes](https://github.com/witchbladeq/MR-Star-OpenRGB/blob/main/protocol.md) · [Scene catalog](https://github.com/witchbladeq/MR-Star-OpenRGB/blob/main/scenes.md)
- Montserrat is bundled under the SIL Open Font License 1.1. [Font license](public/fonts/OFL-Montserrat.txt)
- Interface icons are provided by Lucide. [Lucide](https://lucide.dev/) · [Icon license](public/licenses/lucide.txt)
