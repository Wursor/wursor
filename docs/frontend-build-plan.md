# Frontend build plan: every Figma screen

Source: Figma file `SQoC8dnuDlf6q7OGFZZYH2` ("Wursor - weown.net"), page **Product Design** (`19:2`). Generated from the file's own structure so no screen is missed.

Each screen exists in up to four versions: desktop light (1440 wide), mobile light (390), desktop dark and mobile dark. They are built as **one responsive component per screen**; dark comes from the token set (`tokens.css`), not from separate markup. A screen is done only when all four versions match their frames.

Status key: `todo` · `built` (code written, tests pass) · `verified` (compared to all four frames).

**Progress:** sections 1, 2, 3, 4, A, B0, B, D, 5 and 6 built. Section 1 and 2: 18 screens. Measured against Figma so far: 1a, 1b, 1c and 2a on desktop light, 1c on desktop dark, and 1a, 1b and 2a on mobile (dark for 2a). D2 checked against Figma geometry on desktop light, and on mobile dark by eye. Everything else shares the same components and is covered by unit tests but has not been compared frame by frame. See `design-discrepancies.md` for places the design and an existing decision disagree.

**Totals:** 163 distinct screens · 647 frames to match (desktop light 154, mobile light 170, desktop dark 153, mobile dark 170).


## 1 · Sign up

| Screen | Desktop light | Mobile light | Desktop dark | Mobile dark | Status |
|---|---|---|---|---|---|
| 1a · Welcome | `41:508` | `134:53060` | `141:56156` | `136:56007` | built |
| 1b · Email entry | `41:539` | `134:29204` | `136:36086` | `136:56027` | built |
| 1c · Email not valid | `41:579` | `134:29236` | `136:36104` | `136:56043` | built |
| 1d · Sending code | `41:619` | `134:29268` | `136:36122` | `136:56059` | built |
| 1e · Sign in | `41:659` | `134:29300` | `136:36140` | `136:56075` | built |
| 1f · Sign in, email entry | `166:60281` | `167:131` | `167:22` | `167:264` | built |
| 1g · No account with that email | `166:60297` | `167:149` | `167:38` | `167:282` | built |
| 1h · Sign in, sending code | `176:2` | `176:494` | `176:263` | `176:791` | built |

## 2 · Verify email

| Screen | Desktop light | Mobile light | Desktop dark | Mobile dark | Status |
|---|---|---|---|---|---|
| 2a · Enter code | `41:689` | `134:29330` | `136:36161` | `136:56096` | built |
| 2b · Checking code | `41:732` | `134:29371` | `136:36180` | `136:56113` | built |
| 2c · Wrong code | `41:776` | `134:29413` | `136:36200` | `136:56131` | built |
| 2d · New code sent | `41:820` | `134:29455` | `136:36220` | `136:56149` | built |
| 2e · Code expired | `41:867` | `134:29500` | `136:36240` | `136:56167` | built |
| 2f · Too many tries | `41:918` | `134:29545` | `136:36260` | `136:56185` | built |
| 2g · Sign in, enter code | `176:18` | `176:512` | `176:279` | `176:809` | built |
| 2h · Sign in, checking code | `176:35` | `176:531` | `176:296` | `176:828` | built |
| 2i · Sign in, wrong code | `176:53` | `176:551` | `176:314` | `176:848` | built |
| 2j · Sign in, new code sent | `176:71` | `176:571` | `176:332` | `176:868` | built |

## 3 · Name your workspace

| Screen | Desktop light | Mobile light | Desktop dark | Mobile dark | Status |
|---|---|---|---|---|---|
| 3a · Empty | `42:640` | `134:29588` | `136:36281` | `136:56204` | built |
| 3b · Owner, one site | `42:723` | `134:29663` | `136:36309` | `136:56232` | built |
| 3c · Agency, several sites | `42:805` | `134:29739` | `136:36337` | `136:56260` | built |

## 4 · Where should your site live? (the fork)

| Screen | Desktop light | Mobile light | Desktop dark | Mobile dark | Status |
|---|---|---|---|---|---|
| 4a · Nothing chosen | `92:16444` | `134:31999` | `136:45751` | `136:57015` | built |
| 4b · Wursor Cloud chosen | `92:16589` | `134:32101` | `136:45774` | `136:57038` | built |
| 4c · Connect my WordPress chosen | `92:16726` | `134:32204` | `136:45797` | `136:57061` | built |
| 4d · Build here, publish to my WordPress chosen | `92:16863` | `134:32307` | `136:45820` | `136:57084` | built |

## A · Start on Wursor Cloud

| Screen | Desktop light | Mobile light | Desktop dark | Mobile dark | Status |
|---|---|---|---|---|---|
| A1a · About your site, empty | `92:17814` | `134:32411` | `136:45844` | `136:57108` | built |
| A1b · About your site, answered | `92:17950` | `134:32501` | `136:45878` | `136:57142` | built |
| A2a · Pick a look, still designing | `92:18081` | `134:32591` | `136:45912` | `136:57176` | built |
| A2b · Pick a look, three ready | `92:18181` | `134:32670` | `136:45934` | `136:57198` | built |
| A2c · Pick a look, one chosen | `92:18300` | `134:32768` | `136:45957` | `136:57221` | built |
| A4a · Setting up your site | `92:18415` | `134:32867` | `136:45980` | `136:57244` | built |
| A4b · Your site is live | `92:18509` | `134:32927` | `136:46006` | `136:57270` | built |
| A3a · Building your site (first build) | `92:18616` | `134:33197` (Chat), `134:33428` (Preview) | `136:46026` | `136:57290` (Chat), `136:57310` (Preview) | built |
| A3b · Your site is ready for you | `92:18932` | `134:33685` (Chat), `134:33877` (Preview) | `136:46086` | `136:57354` (Chat), `136:57373` (Preview) | built |

## B0 · Where is your WordPress, and WordPress.com sign-in

| Screen | Desktop light | Mobile light | Desktop dark | Mobile dark | Status |
|---|---|---|---|---|---|
| 5a · Where is your site, nothing chosen | `92:19256` | `134:30860` | `136:46119` | `136:56648` | built |
| 5b · WordPress.com chosen | `92:19346` | `134:30917` | `136:46143` | `136:56672` | built |
| 5c · Somewhere else chosen | `92:19432` | `134:30975` | `136:46167` | `136:56696` | built |
| 5d · Sign in with WordPress.com | `92:19518` | `134:31033` | `136:46191` | `136:56720` | built |
| 5e · Finish signing in on WordPress.com | `92:19598` | `134:31098` | `136:46228` | `136:56757` | built |
| 5f · Choose a WordPress.com site | `92:19689` | `134:31165` | `136:46252` | `136:56781` | built |
| 5g · Problem: sign-in window closed | `92:19764` | `134:31224` | `136:46274` | `136:56803` | built |

## B · Connect my WordPress

| Screen | Desktop light | Mobile light | Desktop dark | Mobile dark | Status |
|---|---|---|---|---|---|
| 4a · Enter site address | `42:905` | `134:29823` | `136:36367` | `136:56290` | built |
| 4b · Checking address | `42:962` | `134:29875` | `136:36389` | `136:56312` | built |
| 4c · Site recognised, choose a route | `42:1018` | `134:29926` | `136:36411` | `136:56334` | built |
| 4d · Waiting for approval | `42:1084` | `134:29991` | `136:36433` | `136:56356` | built |
| 4e · Pairing code route | `42:1161` | `134:30065` | `136:36457` | `136:56380` | built |
| 4f · Connecting, in progress | `42:1263` | `134:30141` | `136:36498` | `136:56421` | built |
| 4g · Connected | `42:1319` | `134:30198` | `136:36520` | `136:56443` | built |
| 4h · Problem: site not reachable | `42:1403` | `134:30289` | `136:36545` | `136:56468` | built |
| 4i · Problem: not WordPress | `42:1473` | `134:30352` | `136:36565` | `136:56488` | built |
| 4j · Problem: helper blocked | `42:1542` | `134:30416` | `136:36585` | `136:56508` | built |
| 4k · Problem: code expired | `42:1609` | `134:30484` | `136:36605` | `136:56528` | built |
| 4l · Problem: no permission | `42:1678` | `134:30554` | `136:36625` | `136:56548` | built |
| 4m · Connected, Content only | `92:19846` | `134:30609` | `136:36641` | `136:56564` | built |
| 4n · Problem: host does not allow plugins | `92:19939` | `134:30683` | `136:36662` | `136:56585` | built |
| 4o · Empty site found | `92:20011` | `134:30733` | `136:36681` | `136:56604` | built |
| 4p · This site already has pages | `92:20097` | `134:30803` | `136:36704` | `136:56627` | built |

## D · Connect your web address

| Screen | Desktop light | Mobile light | Desktop dark | Mobile dark | Status |
|---|---|---|---|---|---|
| D1 · Enter your web address | `92:20295` | `134:33965` | `136:46294` | `136:57390` | built |
| D2 · Add this record, waiting | `92:20383` | `134:34015` | `136:46316` | `136:57412` | built |
| D3 · The record is wrong | `92:20482` | `134:34085` | `136:46341` | `136:57437` | built |
| D4 · Securing the connection | `92:20571` | `134:34145` | `136:46363` | `136:57459` | built |
| D5 · Ready to switch | `92:20656` | `134:34196` | `136:46385` | `136:57481` | built |
| D6 · Live on your web address | `92:20745` | `134:34250` | `136:46405` | `136:57501` | built |

## C · Build here, publish to my WordPress

| Screen | Desktop light | Mobile light | Desktop dark | Mobile dark | Status |
|---|---|---|---|---|---|
| C4 · Ready for you, publish to your WordPress | `92:20845` | `134:35029` (Chat), `134:35221` (Preview) | `136:46427` | `136:57758` (Chat), `136:57777` (Preview) | todo |
| C5a · Publishing to your WordPress | `92:20877` | `134:51614` | `136:46459` | `136:57793` | todo |
| C5b · Published to your WordPress | `92:20966` | `134:51669` | `136:46482` | `136:57816` | todo |

## 5 · Wursor takes a look

| Screen | Desktop light | Mobile light | Desktop dark | Mobile dark | Status |
|---|---|---|---|---|---|
| 5a · Scanning (live) | `46:1393` | `134:31273` | `136:36725` | `136:56823` | built |
| 5b · Here is what I know | `46:1497` | `134:31372` | `136:36755` | `136:56853` | built |
| 5c · Partly blocked | `46:1636` | `134:31520` | `136:36790` | `136:56888` | built |

## 6 · Pick a first change

| Screen | Desktop light | Mobile light | Desktop dark | Mobile dark | Status |
|---|---|---|---|---|---|
| 6a · Nothing chosen | `46:1767` | `134:31646` | `136:36824` | `136:56922` | built |
| 6b · Suggestion chosen | `46:1862` | `134:31734` | `136:36847` | `136:56945` | built |
| 6c · Own change typed | `46:1955` | `134:31822` | `136:36870` | `136:56968` | built |
| 6d · Content only, suggestions | `92:20201` | `134:31910` | `136:36893` | `136:56991` | built |

## W1 · Workspace, the life of a change

| Screen | Desktop light | Mobile light | Desktop dark | Mobile dark | Status |
|---|---|---|---|---|---|
| Wa · Plan ready | `51:3705` | `134:45370` (Chat), `134:45597` (Preview) | `136:36917` | `136:62966` (Chat), `136:63002` (Preview) | todo |
| Wb · Working (Steps) | `51:4012` | `134:45892` (Chat), `134:46129` (Preview) | `136:36992` | `136:63045` (Chat), `136:63065` (Preview) | todo |
| Wc · Working (Headline) | `51:4359` | `134:46395` (Chat), `134:46596` (Preview) | `136:37052` | `136:63109` (Chat), `136:63125` (Preview) | todo |
| Wd · Working (Everything) | `51:4670` | `134:46916` (Chat), `134:47171` (Preview) | `136:37108` | `136:63169` (Chat), `136:63191` (Preview) | todo |
| We · Needs you | `51:5035` | `134:47453` (Chat), `134:47670` (Preview) | `136:37170` | `136:63235` (Chat), `136:63252` (Preview) | todo |

## W2 · Workspace, review and publish

| Screen | Desktop light | Mobile light | Desktop dark | Mobile dark | Status |
|---|---|---|---|---|---|
| Wf · Ready for you (Compare) | `51:5329` | `134:47922` (Chat), `134:48115` (Preview) | `136:37227` | `136:63296` (Chat), `136:63315` (Preview) | todo |
| Wg · Publishing | `51:5651` | `134:48377` (Chat), `134:48545` (Preview) | `136:37259` | `136:63331` (Chat), `136:63350` (Preview) | todo |
| Wh · Published | `51:5941` | `134:48791` (Chat), `134:48950` (Preview) | `136:37291` | `136:63366` (Chat), `136:63384` (Preview) | todo |
| Wi · Proof | `51:6184` | `134:49224` (Chat), `134:49424` (Preview) | `136:37321` | `136:63400` (Chat), `136:63419` (Preview) | todo |

## 7 · Watch it work, approve, publish

| Screen | Desktop light | Mobile light | Desktop dark | Mobile dark | Status |
|---|---|---|---|---|---|
| 7a · Guide: conversation | `52:4183` | `134:49725` (Chat), `134:49963` (Preview) | `136:37361` | `136:63444` (Chat), `136:63464` (Preview) | todo |
| 7b · Guide: preview | `52:4243` | `134:50266` (Chat), `134:50504` (Preview) | `136:37422` | `136:63508` (Chat), `136:63528` (Preview) | todo |
| 7c · Guide: board | `52:4303` | `134:50807` (Chat), `134:51045` (Preview) | `136:37483` | `136:63572` (Chat), `136:63592` (Preview) | todo |
| 7d · Guide: approve | `52:4363` | `134:51304` (Chat), `134:51498` (Preview) | `136:37544` | `136:63636` (Chat), `136:63655` (Preview) | todo |

## H · Home

| Screen | Desktop light | Mobile light | Desktop dark | Mobile dark | Status |
|---|---|---|---|---|---|
| H1 · First run, guided setup | `60:5467` | `134:35585` | `136:37578` | `136:61471` | todo |
| H2 · Active, needs you | `60:5675` | `134:35822` | `136:37621` | `136:61513` | todo |
| H3 · All caught up | `60:5936` | `134:36100` | `136:37673` | `136:61564` | todo |
| H4 · Site problem | `60:6186` | `134:36349` | `136:37727` | `136:61617` | todo |
| H5 · First run, Cloud track, building | `95:20577` | `134:36597` | `136:37769` | `136:61658` | todo |
| H6 · Site problem, Cloud site | `95:20620` | `134:36824` | `136:37812` | `136:61700` | todo |

## S · Sites

| Screen | Desktop light | Mobile light | Desktop dark | Mobile dark | Status |
|---|---|---|---|---|---|
| S1 · Sites, one site | `61:6042` | `134:37052` | `136:37855` | `136:61742` | todo |
| S2 · Sites, agency (many) | `61:6175` | `134:37229` | `136:37869` | `136:61755` | todo |
| S3 · Site detail, overview | `61:6410` | `134:37587` | `136:37895` | `136:61780` | todo |
| S4 · Site detail, own WordPress, connection | `61:6672` | `134:37850` | `136:37945` | `136:61829` | todo |
| S5 · Sites, empty | `61:6901` | `134:38044` | `136:37980` | `136:61863` | todo |
| S6 · Site detail, where it lives (Wursor Cloud) | `95:19095` | `134:38194` | `136:37994` | `136:61876` | todo |
| S7 · Site detail, where it lives (Content only) | `95:19279` | `134:38401` | `136:38018` | `136:61899` | todo |
| S8 · Site detail, Cloud site on preview address | `95:19455` | `134:38596` | `136:38041` | `136:61921` | todo |

## T · Settings

| Screen | Desktop light | Mobile light | Desktop dark | Mobile dark | Status |
|---|---|---|---|---|---|
| T1 · Settings, workspace | `62:6754` | `134:38817` | `136:45013` | `136:61945` | todo |
| T2 · Settings, safety and approvals | `62:6974`, `62:8721` | `134:39059` | `136:45041` | `136:61972` | todo |
| T3 · Settings, team | `62:7243` | `134:39323` | `136:45094` | `136:62024` | todo |
| T4 · Settings, billing | `62:7478` | `134:39555` | `136:45137` | `136:62066` | todo |
| T5 · Settings, notifications | `62:7781` | `134:39858` | `136:45169` | `136:62097` | todo |
| T6 · Settings, account | `62:8003` | `134:40094` | `136:45202` | `136:62129` | todo |

## K · Keyboard and command palette

| Screen | Desktop light | Mobile light | Desktop dark | Mobile dark | Status |
|---|---|---|---|---|---|
| K1 · Command palette, open | `86:18930` | — | `136:45238` | — | todo |
| K2 · Command palette, asking for a change | `86:19134` | — | `136:45335` | — | todo |
| K3 · Command palette, searching | `86:19273` | — | `136:45422` | — | todo |
| K4 · Keyboard shortcuts | `86:19435` | — | `136:45513` | — | todo |
| K5 · Shortcuts shown in context | `86:19580` | — | `136:45617` | — | todo |
| K6 · Keyboard focus and tab order | `86:19858` | — | `136:45696` | — | todo |
| K1 · Search and actions, open | — | `134:51964` | — | `136:63672` | todo |
| K2 · Search and actions, asking for a change | — | `134:52325` | — | `136:63732` | todo |
| K3 · Search and actions, searching | — | `134:52626` | — | `136:63782` | todo |

## M · Moving a site, both directions

| Screen | Desktop light | Mobile light | Desktop dark | Mobile dark | Status |
|---|---|---|---|---|---|
| M1 · Move to my own WordPress, choose where | `95:19658` | `134:34316` | `136:46504` | `136:57523` | todo |
| M2 · Move out, what will move | `95:19729` | `134:34356` | `136:46524` | `136:57543` | todo |
| M3 · Move out, copying | `95:19834` | `134:34427` | `136:46547` | `136:57566` | todo |
| M4 · Move out, ready to switch | `95:19916` | `134:34475` | `136:46570` | `136:57589` | todo |
| M5 · Move out, moved | `95:20013` | `134:34537` | `136:46592` | `136:57611` | todo |
| M6 · Move out, problem, nothing changed | `95:20089` | `134:34581` | `136:46614` | `136:57633` | todo |
| M7 · Host on Wursor Cloud, what will move | `95:20177` | `134:34628` | `136:46635` | `136:57654` | todo |
| M8 · Host on Wursor Cloud, copying | `95:20272` | `134:34689` | `136:46657` | `136:57676` | todo |
| M9 · Host on Wursor Cloud, review the copy | `95:20343` | `134:34726` | `136:46678` | `136:57697` | todo |
| M10 · Host on Wursor Cloud, hosted | `95:20419` | `134:34773` | `136:46698` | `136:57717` | todo |
| M11 · Host on Wursor Cloud, Content only | `95:20490` | `134:34812` | `136:46717` | `136:57736` | todo |

## AC · Activity

| Screen | Desktop light | Mobile light | Desktop dark | Mobile dark | Status |
|---|---|---|---|---|---|
| AC1 · Activity, feed | `124:20127` | `134:40312` | `136:46739` | `136:62164` | todo |
| AC2 · Activity, filtered to Checks | `124:20353` | `134:40547` | `136:46773` | `136:62197` | todo |
| AC3 · Activity, loading | `124:20524` | `134:40742` | `136:46798` | `136:62221` | todo |
| AC4 · Activity, empty | `124:20693` | `134:40921` | `136:46822` | `136:62244` | todo |
| AC5 · Activity, event proof | `124:20800` | `134:41095` | `136:46831` | `136:62252` | todo |
| AC6 · Activity, nothing matches | `124:20992` | `134:41290` | `136:46878` | `136:62276` | todo |
| AC7 · Activity, could not load | `124:21153` | `134:41466` | `136:46898` | `136:62295` | todo |
| AC8 · Activity, offline | `124:21309` | `134:41656` | `136:46919` | `136:62315` | todo |
| AC9 · Activity, all sites (agency) | `124:21448` | `134:41861` | `136:46945` | `136:62340` | todo |

## BD · Board

| Screen | Desktop light | Mobile light | Desktop dark | Mobile dark | Status |
|---|---|---|---|---|---|
| BD1 · Board, all lanes | `124:22436` | `134:42072` | `136:46971` | `136:62365` | todo |
| BD2 · Board, empty | `124:22677` | `134:42320` | `136:47006` | `136:62399` | todo |
| BD3 · Board, loading | `124:22812` | `134:42521` | `136:47021` | `136:62413` | todo |
| BD4 · Board, list view | `124:22976` | `134:42718` | `136:47077` | `136:62468` | todo |
| BD5 · Change detail drawer | `125:15782` | `134:42965` | `136:47139` | `136:62529` | todo |
| BD6 · Dragging a card | `125:15891` | `134:43236` | `136:47215` | `136:62563` | todo |
| BD7 · All sites board (agency) | `125:22726` | `134:43555` | `136:47253` | `136:62599` | todo |
| BD8 · New change composer | `125:16031` | `134:43853` | `136:47339` | `136:62684` | todo |
| BD9 · Filter, nothing matches | `125:22331` | `134:44100` | `136:47392` | `136:62718` | todo |
| BD10 · Offline | `125:22575` | `134:44281` | `136:47406` | `136:62731` | todo |
| BD11 · Board, calendar view | `156:72213` | `156:73458` | `156:72853` | — | todo |
| BD5 · Change detail sheet | — | `134:52948` | — | `136:62766` | todo |
| BD8 · New change sheet | — | `134:53023` | — | `136:62843` | todo |
| DK · M · BD11 · Board, calendar view | — | — | — | `156:73900` | todo |

## SY · System states

| Screen | Desktop light | Mobile light | Desktop dark | Mobile dark | Status |
|---|---|---|---|---|---|
| SY1 · Content only, code change blocked | `125:23147` | `134:44531` | `136:47443` | `136:62898` | todo |
| SY2 · Something went wrong | `125:23256` | `134:44666` | `136:47451` | `136:62905` | todo |
| SY3 · Monthly limit reached | `125:23360` | `134:44799` | `136:47459` | `136:62912` | todo |
| SY4 · Session expired | `125:23472` | `134:52807` | `136:47468` | `136:62946` | todo |
| SY5 · Maintenance | `125:23579` | `134:52862` | `136:47477` | `136:62954` | todo |
| SY6 · Page not found | `125:23591` | `134:52872` | `136:47482` | `136:62959` | todo |
| SY7 · Site unreachable | `125:23604` | `134:44941` | `136:47488` | `136:62920` | todo |
| SY8 · Home loading | `125:23715` | `134:45095` | `136:47500` | `136:62931` | todo |
| SY9 · Toasts and dialogs | `125:23845` | — | `136:47516` | — | todo |
| SY10 · Empty states | `125:23889` | — | `136:47528` | — | todo |

## N · Navigation and feedback

| Screen | Desktop light | Mobile light | Desktop dark | Mobile dark | Status |
|---|---|---|---|---|---|
| N1 · More tab | — | `134:59417` | — | `136:63837` | todo |
| N2 · Site switcher | — | `134:59524` | — | `136:63886` | todo |
| N3 · Notifications | — | `134:59608` | — | `136:63958` | todo |
| N4 · Toasts, dialog and sheet | — | `134:59690` | — | `136:64018` | todo |
