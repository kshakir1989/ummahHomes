# Demo walkthrough videos

MP4 recordings of complete flows for each demo role.

| File | Role | Flow |
|------|------|------|
| `seller-flow.mp4` | Seller (dual-role account, Seller selected) | Dashboard → listings → create form → requests → inbox |
| `buyer-flow.mp4` | Buyer | Dashboard → browse sale → listing → my interests → inbox |
| `renter-flow.mp4` | Renter | Dashboard → browse rent → apply → my applications → inbox |
| `admin-flow.mp4` | Admin | Users, listings (search), applicants |
| `browse-flow.mp4` | Browse (guest) | Entry scroll → View Homes → filters → 3-column grid |

## Regenerate — browse (web)

```bash
cd apps/ummahHomes
npm run web   # in another terminal
npm run record:browse:web
```

Output: `demoStore/web/browse-flow.mp4`

## Regenerate — browse (iOS)

```bash
cd apps/ummahHomes
npx expo start   # in another terminal
npm run record:browse:ios
```

Output: `demoStore/ios/browse-flow.mp4`

## Regenerate — web

```bash
cd apps/ummahHomes
npm run web   # in another terminal
npm run record:demos:web
```

Output: `demoStore/web/*.mp4`

## Regenerate — iOS

Requires Xcode, iPhone 17 simulator, and a one-time Detox build.

```bash
cd apps/ummahHomes
npx expo start   # in another terminal
npm run record:demos:ios
```

Output: `demoStore/ios/*.mp4`

Videos are gitignored except this README; commit MP4s only when you intentionally want them in the repo.
