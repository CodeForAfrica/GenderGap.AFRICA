# Gender Gap Clock

🙎🏾⏰


## Setup instructions

1) Clone the repository:

```
git clone https://github.com/CodeForAfrica/GenderGapClock.git
cd GenderGapClock
```

2) Download dependencies:

```
npm install
```

3) Build:

```
gulp
```

4) Set up a server and watch for changes:

```
gulp serve
```

## Localisation

To localise the tool to a specific country, add the query string parameter `country`:

```
?country=tanzania
```

Spaces should be added as `%20` so for example south africa would be:

```
?country=south%20africa
```

Localisation will mean that the country name will be pre-populated, but users can still change this if they choose to do so.


## Browser support

### Desktop browsers:

+ Chrome 56 and 57.
+ Firefox 51 and 52.
+ Edge 13 and 14.
+ Safari 9 and 10.
+ Opera 43 and 44.
+ Internet Explorer 11.

### Mobile browsers:

+ Chrome for Android 56 and 57.
+ Chrome for iOS 9 and 10.
+ Safari for iOS 9 and 10.
