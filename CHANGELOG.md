<!--
## 0.x.x (unreleased)

### Features

### Improvements

### Changes

### Bugfixes

-->

## Unreleased
### Features
- Add parseHtml

## 0.24.0
### Features
- Supports Unicode 15.0 emoji

## 0.23.3
- tweak fn parsing
- fnNameList option removed
- emojiCodeList option removed

## 0.23.2
### Features
- Supports whitelisting of emoji code names. (#130)

## 0.23.1
### Improvements
- improve emoji code parsing

## 0.23.0

### Features
- Add Plain syntax (#101)

### Improvements
- The parser is now implemented in TypeScript! 🎉 (#92)
- Disable all syntax when nesting limited (#90)

### Changes
- Rename existing plain series (#113):
  - parsePlain -> parseSimple
  - MfmPlainNode -> MfmSimpleNode

### Bugfixes
- Fix a bug that allows line breaks in link label (#115)

## 0.22.1

### Improvements
- Removes a unnecessary built file

## 0.22.0

### Features
- Unicode emoji supports Unicode 14.0 emoji (#109)

### Improvements
- `（）` pair is available on outside the hashtag (#111)
- Changes specs the center tag and strike (#108, 100fb0b)
- Improves link label parsing (#107)

### Bugfixes
- If there is a `[]` pair before the link, it will be mistakenly recognized as a part of link label. (#104)

## 0.21.0

### Features
- Supports nestLimit option. (#87, #91)

### Improvements
- Improve generation of brackets property of url node.

### Bugfixes
- Fix the Link node of the enclosed in `<>`. (#84)
- Fix parsing of the link label.

## 0.20.0

### Features
- Add tag syntaxes of bold `<b></b>` and strikethrough `<s></s>`. (#76)
- Supports whitelisting of MFM function names. (#77)

### Improvements
- Mentions in the link label are parsed as text. (#66)
- Add a property to the URL node indicating whether it was enclosed in `<>`. (#69)
- Disallows `<` and `>` in hashtags. (#74)
- Improves security.

### Changes
- Abolished MFM function v1 syntax. (#79)

## 0.19.0

### Improvements
- Ignores a blank line after quote lines. (#61)

## 0.18.0

### Improvements
- Twemoji v13.1 is supported.

## 0.17.0

### Improvements
- Improves syntax of inline code.
- Improves syntax of url.
- Improves syntax of hashtag.
