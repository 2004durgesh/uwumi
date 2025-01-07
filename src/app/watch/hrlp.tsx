// import "react-native-gesture-handler";
// import {
//     ActivityIndicator,
//     Dimensions,
//     StatusBar,
//     StyleSheet,
//     Text,
//     View,
//     BackHandler,
//     Modal,
//     TouchableOpacity,
//     FlatList,
//     Pressable,
//     Alert,
//     ToastAndroid,
// } from "react-native";
// import React, { useState, useEffect, useRef, useCallback, useMemo, useContext } from "react";
// import { Gesture, GestureDetector, GestureHandlerRootView, Directions } from "react-native-gesture-handler";
// import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";

// import data from "../services/data";

// // import { Video, ResizeMode } from "expo-av";
// import Video, { VideoRef, TextTrackType } from "react-native-video";
// // import { TextTrackType } from "react-native-video/lib/types/video";
// import * as ScreenOrientation from "expo-screen-orientation";
// import * as Brightness from "expo-brightness";
// import { VolumeManager } from "react-native-volume-manager";

// import VideoControls from "../components/videoControls";
// import { COLORS } from "../constants/theme";
// import { globalStyles } from "../styles/globalStyles";
// import { TouchableWithoutFeedback } from "react-native-gesture-handler";
// import EpisodeListModal from "../components/episodeListModal";
// import { EpisodeContext } from "../context/episodeContexProvider";

// // redux
// import { useDispatch, useSelector } from "react-redux";
// import { selectAllEpisodes, updateEpisode } from "../redux/features/episodeSlice";
// import { useKeepAwake } from "expo-keep-awake";
// import { formatToSeconds } from "../utils/utils";
// import ActivityIndicatorCustom from "../components/activityIndicatorCustom";
// import { selectAccentColor, selectAutoSkip } from "../redux/features/settingsSlice";

// const WatchScreen = ({ navigation, route }) => {
//     // console.log(route.params);
//     // console.log(currentEpisode.id);
//     // console.log(`${currentEpisode} and ${currentEpisodeIndex}`);
//     const isAutoPlayNext = useSelector((state) => state.settings.isAutoPlayNext);
//     const isAutoSkip = useSelector(selectAutoSkip);
//     const accentColorGlobal = useSelector(selectAccentColor);
//     const allEpisodesList = useSelector(selectAllEpisodes);

//     const videoRef = useRef(null);
//     const [response, setResponse] = useState([]);
//     const [videoUrl, setVideoUrl] = useState([]);
//     const [referer, setReferer] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     // const [status, setStatus] = useState({});
//     const [isLocked, setIsLocked] = useState(false);
//     const [isShowControls, setShowControls] = useState(false);
//     const [isFullscreen, setIsFullscreen] = useState(true);
//     const { getEpisodeSources, getZoroEpisodeSource } = data;

//     const [orientation, setOrientation] = useState(1);
//     const [videoDuration, setVideoDuration] = useState(0);
//     const [currentTime, setCurrentTime] = useState(0);
//     const [isPlaying, setIsPlaying] = useState(true);
//     const [hqModalIsShow, setHqModalIsShow] = useState(false);
//     const [epModalShow, setEpModalShow] = useState(false);
//     const [currentUrl, setCurrentUrl] = useState(null);
//     const [selectedQuality, setSelectedQuality] = useState(null);
//     const [isLoadingQualitySwitch, setIsLoadingQualitySwitch] = useState(false);
//     const [playbackSpeed, setPlaybackSpeed] = useState(1);
//     const playbackSpeedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];
//     const [videoSliderVisible, setVideoSliderVisible] = useState(false);
//     const [videoRate, setVideoRate] = useState(1);

//     const [brightnessVal, setBrightnessVal] = useState(0.1);
//     const [initialBrightnessVal, setInitialBrightnessVal] = useState(0.1);
//     const [brigthControlisVisible, setBrigthControlisVisible] = useState(false);
//     const [globalBrigthness, setOriginalBrigthness] = useState(null);
//     const [volumeVal, setVolumeVal] = useState(0.2);
//     const [systemVol, setSystemVol] = useState(null);
//     const [initVolumeVal, setInitVolumeVal] = useState(null);
//     const hideBrigthnessTimeout = useRef(null);
//     const hideVolumeTimeout = useRef(null);
//     const hideDoubleTapTimeout = useRef(null);

//     const [volumeControlVisible, setVolumeControlVisible] = useState(false);
//     const [isVisible, setIsVisible] = useState({
//         forward: false,
//         backward: false,
//     });
//     const [doubleTapVal, setDoubleTapVal] = useState({
//         forward: 0,
//         backward: 0,
//     });
//     const [skipTimes, setSkiptimes] = useState([]);
//     const [intro, setIntro] = useState([]);
//     const [outro, setOutro] = useState([]);
//     const [skipData, setSkipData] = useState({});
//     const [trackText, setTrackText] = useState("");

//     const [isDoubleTap, setIsDoubletap] = useState(false);
//     const isInteractingWithControls = useRef(null);
//     const interactionTimeoutRef = useRef(null);

//     const epModalRef = useRef(null);

//     // console.log(`onlaod: ${currentUrl}`);

//     //useSelector redux
//     const dispatch = useDispatch();

//     const {
//         currentEpisode: currentEpisodeRedux,
//         currentEpisodeNumber: currentEpisodeNumberRedux,
//         currentEpisodeIndex: currentEpisodeIndexRedux,
//         selectedChunk: selectedChunk1,
//         globalEpisodeList: globalEpisodeList1,
//         selectedEpisode: selectedEpisodeRedux,
//     } = useSelector((state) => state.epData.episodeData);

//     const provider = useSelector((state) => state.epData.episodeData.provider);
//     // console.log(provider);
//     //keep awake
//     useKeepAwake();

//     //toggle lock Controls
//     const toggleLock = () => {
//         setIsLocked(!isLocked);
//     };

//     // useEffect(() => {
//     //     fetchIntroSkipTimes();
//     // }, [route.params.malId, currentEpisodeNumberRedux]);

//     // const fetchIntroSkipTimes = async () => {
//     //     try {
//     //         console.log(videoDuration);
//     //         const response = await fetch(
//     //             `https://api.aniskip.com/v2/skip-times/${route.params.malId}/${currentEpisodeNumberRedux}?types=op&episodeLength=${videoDuration}`
//     //         );
//     //         const intro = await response.json();
//     //         console.log(intro);
//     //     } catch (error) {
//     //         console.log(error);
//     //     }
//     // };

//     useEffect(() => {
//         fetchSkipTimes();
//     }, [route.params.id]);

//     //get skipTimes
//     const fetchSkipTimes = async () => {
//         try {
//             // console.log(route.params.id, "ID");
//             const res = await fetch(`https://anify.eltik.cc/skip-times/${route.params.id}`);
//             const times = await res.json();

//             setSkiptimes(times);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     //find skip time for current episode
//     const getSkipData = () => {
//         if (currentEpisodeNumberRedux !== null && currentEpisodeNumberRedux !== undefined) {
//             const skipData = skipTimes?.episodes?.find((epNumber, index) => {
//                 if (epNumber.number === currentEpisodeNumberRedux) {
//                     return epNumber;
//                 }
//             });
//             return skipData;
//         }
//     };

//     useEffect(() => {
//         if (skipTimes) {
//             const a = getSkipData();

//             if (a) {
//                 // console.log(a);
//                 setSkipData(a);
//             } else {
//                 setSkipData({});
//             }
//         }
//     }, [currentEpisodeNumberRedux, skipTimes]);

//     // function to skip the intro called in vidcontrols
//     const skipIntro = (skipData, endTime) => {
//         // const targetPosition = endTime * 1000;
//         videoRef.current.getCurrentPosition().then((status) => {
//             // console.log(status.positionMillis, targetPosition);
//             videoRef.current.seek(endTime);
//         });
//     };

//     //function to skip ed
//     const skipEnding = (skipData, endTime) => {
//         const targetPosition = endTime;
//         videoRef.current.getCurrentPosition().then((status) => {
//             console.log(status.positionMillis, targetPosition);
//             videoRef.current.seek(targetPosition);
//             // videoRef.current.setPositionAsync(targetPosition);
//         });
//     };

//     const introSkippedRef = useRef(false);
//     const outtroSkippedRef = useRef(false);

//     useEffect(() => {
//         if (isAutoSkip && skipData.intro?.start) {
//             // Reset the flag if the user rewinds back before the intro's start time
//             if (currentTime < skipData.intro.start) {
//                 introSkippedRef.current = false;
//             }

//             // Check if intro hasn't been skipped yet and the current time is at or past the intro start time
//             if (!introSkippedRef.current && currentTime >= skipData.intro?.start) {
//                 console.log("hey skip intro");
//                 skipIntro(skipData, skipData.intro.end);
//                 ToastAndroid.show("Intro Skipped", ToastAndroid.SHORT);
//                 introSkippedRef.current = true; // Mark as skipped
//             }
//         }
//     }, [isAutoSkip, currentTime, skipData]);

//     useEffect(() => {
//         if (isAutoSkip && skipData.outro?.start) {
//             // Reset the flag if the user rewinds back before the intro's start time
//             if (currentTime < skipData.outro.start) {
//                 outtroSkippedRef.current = false;
//             }

//             // Check if intro hasn't been skipped yet and the current time is at or past the intro start time
//             if (!outtroSkippedRef.current && currentTime >= skipData.outro?.start) {
//                 console.log("hey skip intro");
//                 skipIntro(skipData, skipData.outro.end);
//                 ToastAndroid.show("Outro Skipped", ToastAndroid.SHORT);
//                 outtroSkippedRef.current = true; // Mark as skipped
//             }
//         }
//     }, [isAutoSkip, currentTime, skipData]);

//     // fetch Episodes
//     useEffect(() => {
//         // console.log(selectedEpisode);
//         if (provider === "meta" || provider === "gogoanime") {
//             fetchMetaEpisodeSource();
//         } else if (provider === "zoro") {
//             // console.log("zoro sources");
//             fetchZoroEpisodesSource();
//         }
//     }, [playNextVideo, selectedEpisodeRedux, globalEpisodeList1, currentEpisodeRedux]);

//     const fetchMetaEpisodeSource = async () => {
//         try {
//             setIsLoading(true);
//             const res = await getEpisodeSources(selectedEpisodeRedux);
//             setResponse(res);
//             // console.log("watchscreen ", res);
//             setReferer(res?.headers.Referer);
//             setVideoUrl(res.sources);
//         } catch (error) {
//             console.log(error);
//             ToastAndroid.show(
//                 "Failed to load source, Please try different source",
//                 ToastAndroid.CENTER,
//                 ToastAndroid.LONG
//             );
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const fetchZoroEpisodesSource = async () => {
//         setIsLoading(true);
//         try {
//             const res = await getZoroEpisodeSource(selectedEpisodeRedux);
//             console.log(res, "zoro");
//             setResponse(res);
//             setVideoUrl(res.sources);
//             // console.log(`res: ${JSON.stringify(res)}`);
//             const subtitle = res.subtitles.find((subtitle) => subtitle.lang === "English")?.url;

//             setTrackText(subtitle);
//             console.log("ENGLISH SUB:", subtitle, trackText);

//             // console.log(res);
//         } catch (error) {
//             console.log(error);
//         } finally {
//             setIsLoading(false);
//             // console.log(res);
//         }
//     };
//     // console.log(`videoURL: ${JSON.stringify(videoUrl)}`);

//     // set the initial quality onLoad of the video
//     useEffect(() => {
//         if (provider === "meta" || provider === "gogoanime") {
//             let vidSource = videoUrl?.find(
//                 (sources) =>
//                     sources.quality === "auto" ||
//                     sources.quality === "backup" ||
//                     sources.quality === "default"
//             )?.url;

//             let vidQuality = videoUrl?.find((sources) => {
//                 return (
//                     sources.quality === "auto" ||
//                     sources.quality === "backup" ||
//                     sources.quality === "default"
//                 );
//             });

//             if (vidSource) {
//                 console.log(vidQuality.quality);
//                 setSelectedQuality(vidQuality.quality);
//                 setCurrentUrl(vidSource);
//                 // console.log(currentUrl);
//             }
//         } else if (provider === "zoro") {
//             let vidSource = videoUrl[0]?.url;
//             if (vidSource) {
//                 setCurrentUrl(vidSource);
//                 console.log(`vidsource ${vidSource}`);
//             }
//         }
//     }, [videoUrl, provider]);

//     useEffect(() => {
//         if (isShowControls) {
//             console.log("video slider:", videoSliderVisible);
//             if ((!isPlaying && hqModalIsShow) || (!isPlaying && videoSliderVisible)) {
//                 setShowControls(true);
//             } else if (!isPlaying) {
//                 const timeoutId = setTimeout(() => {
//                     setShowControls(false);
//                 }, 5000);

//                 return () => clearTimeout(timeoutId);
//             }
//         }
//     }, [isShowControls, isPlaying, hqModalIsShow, videoSliderVisible]);

//     const toggleFullscreen = async () => {
//         if (!isFullscreen) {
//             await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
//             setIsFullscreen(true);
//         } else {
//             await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
//             setIsFullscreen(false);
//         }
//         setOrientation(await ScreenOrientation.getOrientationAsync());
//     };

//     // paly / pause
//     const togglePlayPause = () => {
//         if (isPlaying) {
//             // videoRef.current.pauseAsync(); //for expo-av
//             videoRef.current.pause();
//         }
//         // } else {
//         // videoRef.current.resume();
//         // videoRef.current.playAsync(); //for expo-av
//         // }
//         setIsPlaying(!isPlaying);
//     };

//     //sets the current time, if video is finished, moves to the next video
//     const handlePlaybackStatusUpdate = (status) => {
//         setCurrentTime(status.positionMillis);
//         if (status.isBuffering) {
//             setIsLoadingQualitySwitch(true);
//         } else if (status.isLoaded) {
//             setIsLoadingQualitySwitch(false);
//         }

//         if (status.isPlaying) {
//             setIsLoadingQualitySwitch(false);
//         }

//         if (status.didJustFinish) {
//             playNextVideo();
//         }
//     };

//     // handle change playback speed
//     const togglePlaybackSpeed = () => {
//         //gets the next playback speed index
//         const nextSpeedIndex = playbackSpeedOptions.indexOf(playbackSpeed) + 1;
//         if (nextSpeedIndex < playbackSpeedOptions.length) {
//             videoRef.current.setRateAsync(playbackSpeedOptions[nextSpeedIndex], true);
//             setPlaybackSpeed(playbackSpeedOptions[nextSpeedIndex]);
//         }
//         //if the last option i.e. 2x speed is applied. then moves to first option
//         else {
//             videoRef.current.setRateAsync(playbackSpeedOptions[0], true);
//             setPlaybackSpeed(playbackSpeedOptions[0]);
//         }
//     };

//     // changes video quality
//     // const handleChangeQuality = async (quality, url) => {
//     //     // setIsLoadingQualitySwitch(true);
//     //     setCurrentUrl(url);
//     //     setSelectedQuality(quality);
//     //     const status = await videoRef.current.getStatusAsync(); //expo-av
//     //     const newPosition = status.positionMillis; //expo-av

//     //     await videoRef.current.pauseAsync();

//     //     await videoRef.current.unloadAsync();
//     //     setCurrentTime(newPosition);
//     //     await videoRef.current.loadAsync({ uri: url }, { positionMillis: newPosition }, false);

//     //     // Set a timeout to ensure the video is properly loaded before setting the position
//     //     await videoRef.current.setPositionAsync(newPosition);
//     //     await videoRef.current.isLoaded;
//     //     setIsPlaying(true);
//     //     await videoRef.current.playAsync();
//     //     // setIsLoadingQualitySwitch(false);
//     // };

//     const handleChangeQuality = async (quality, url) => {
//         // setIsLoadingQualitySwitch(true);
//         setCurrentUrl(url);
//         setSelectedQuality(quality);
//         const status = await videoRef.current.getCurrentPosition();
//         const newPosition = status;

//         videoRef.current.pause();
//         setCurrentTime(newPosition);

//         await videoRef.current.seek(newPosition);
//         setIsPlaying(true);
//     };

//     // hq modal
//     const toggleHqModal = () => {
//         if (hqModalIsShow) {
//             setHqModalIsShow(false);
//             // setIsPlaying(true);
//             // console.log(`modal hide: ${hqModalIsShow}`);
//         } else {
//             setHqModalIsShow(true);
//             // console.log(`modal show: ${hqModalIsShow}`);
//         }
//         // setHqModalIsShow(!hqModalIsShow);
//     };

//     const toggleEpisodeModal = () => {
//         if (epModalShow) {
//             setEpModalShow(false);
//         } else {
//             setEpModalShow(true);
//         }
//     };

//     //handle screen orientation and brightness on exit from watchscreen
//     useEffect(() => {
//         StatusBar.setHidden(false);

//         const backAction = async () => {
//             setIsPlaying(false);
//             setIsFullscreen(false);
//             setOrientation(await ScreenOrientation.getOrientationAsync());

//             if (orientation === 3 || 4) {
//                 await Brightness.restoreSystemBrightnessAsync();
//                 setBrightnessVal(null);
//                 console.log("exiting:" + brightnessVal);
//                 // videoRef.current.pause();

//                 navigation.goBack();
//                 await ScreenOrientation.unlockAsync();
//                 StatusBar.setHidden(false);
//             }

//             return true;
//         };

//         const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

//         return () => backHandler.remove();
//     }, [isFullscreen]);

//     // Gesture handle
//     const doubleTap = useMemo(
//         () =>
//             Gesture.Tap()
//                 .numberOfTaps(2)
//                 .onStart((event) => {
//                     const touchX = event.absoluteX; //get the tap position on X
//                     let mid = Dimensions.get("screen").width / 2;

//                     setIsDoubletap(true);

//                     //if tap position is before the mid point, set video back by 10s
//                     if (!isLocked) {
//                         if (touchX < mid) {
//                             // setIsVisible((prevState) => ({ ...prevState, backward: true }));
//                             let posNew;
//                             showBackwardTap();
//                             videoRef.current.getCurrentPosition().then((time) => {
//                                 console.log(time);
//                                 const newPosition = Math.max(time - 10, 0);
//                                 videoRef.current.seek(+newPosition);
//                                 posNew = newPosition;
//                             });
//                             setIsPlaying(false);
//                             if (posNew <= 0) {
//                                 setDoubleTapVal({ backward: 10 });
//                             } else {
//                                 setDoubleTapVal((counter) => ({
//                                     ...counter,
//                                     backward: counter.backward + 10,
//                                 }));
//                             }
//                         }
//                         //if tap position is before the mid point, set video forward by 10s
//                         else {
//                             // setIsVisible((prevState) => ({ ...prevState, forward: true }));
//                             showForwardTap();
//                             videoRef.current.getCurrentPosition().then((time) => {
//                                 // console.log(time);
//                                 const newPosition = Math.max(time + 10, 0);
//                                 videoRef.current.seek(+newPosition);
//                             });
//                             setIsPlaying(false);
//                             setDoubleTapVal((counter) => ({ ...counter, forward: counter.forward + 10 }));
//                         }
//                     }
//                 })
//                 .onEnd((event) => {
//                     hideDoubleTap();
//                     // setTimeout(() => {
//                     //     setIsDoubletap(false);
//                     //     setIsVisible((prevState) => ({ ...prevState, forward: false, backward: false }));
//                     // }, 1000);
//                 })
//                 .runOnJS(true),
//         [isVisible, setIsVisible]
//     );
//     const showBackwardTap = () => {
//         setIsVisible((prevState) => ({ ...prevState, backward: true }));
//         resetDoubleTapTimeout();
//     };
//     const showForwardTap = () => {
//         setIsVisible((prevState) => ({ ...prevState, forward: true }));
//         resetDoubleTapTimeout();
//     };
//     const resetDoubleTapTimeout = () => {
//         if (hideDoubleTapTimeout.current) {
//             clearTimeout(hideDoubleTapTimeout.current);
//         }
//         hideDoubleTapTimeout.current = setTimeout(() => {
//             setIsVisible((prevState) => ({ ...prevState, forward: false, backward: false }));
//         }, 1500);
//     };

//     const hideDoubleTap = () => {
//         if (hideDoubleTapTimeout.current) {
//             clearTimeout(hideDoubleTapTimeout.current);
//         }
//         hideDoubleTapTimeout.current = setTimeout(() => {
//             setIsVisible((prevState) => ({ ...prevState, forward: false, backward: false }));
//             setDoubleTapVal({ forward: 0, backward: 0 });
//             setIsDoubletap(false);
//         }, 1500);
//     };

//     //brightness slider functions
//     const showSlider = () => {
//         setBrigthControlisVisible(true);
//         resetHideSliderTimer();
//     };

//     const hideSlider = () => {
//         if (hideBrigthnessTimeout.current) {
//             clearTimeout(hideBrigthnessTimeout.current);
//         }
//         hideBrigthnessTimeout.current = setTimeout(() => {
//             setBrigthControlisVisible(false);
//         }, 3000);
//     };

//     const resetHideSliderTimer = () => {
//         if (hideBrigthnessTimeout.current) {
//             clearTimeout(hideBrigthnessTimeout.current);
//         }
//         hideBrigthnessTimeout.current = setTimeout(() => {
//             setBrigthControlisVisible(false);
//         }, 3000);
//     };

//     //volume slider functions
//     const showVolumeSlider = () => {
//         setVolumeControlVisible(true);
//         resetHideVolumeTimer();
//     };

//     const hideVolumeSlider = () => {
//         if (hideVolumeTimeout.current) {
//             clearTimeout(hideVolumeTimeout.current);
//         }

//         hideVolumeTimeout.current = setTimeout(() => {
//             setVolumeControlVisible(false);
//         }, 3000);
//     };

//     const resetHideVolumeTimer = () => {
//         if (hideVolumeTimeout.current) {
//             clearTimeout(hideVolumeTimeout.current);
//         }
//         hideVolumeTimeout.current = setTimeout(() => {
//             setVolumeControlVisible(false);
//         }, 3000);
//     };
//     const volumeChangedByListener = useRef(true);

//     useEffect(() => {
//         VolumeManager.getVolume().then((result) => {
//             setSystemVol(result.volume);
//             console.log("systemVol ", result.volume);
//         });

//         const vol = VolumeManager.addVolumeListener((result) => {
//             volumeChangedByListener.current = true;
//             setSystemVol(result.volume);
//             // console.log("changed volume via system: ", result.volume);
//         });

//         return () => {
//             vol.remove();
//         };
//     }, []);

//     const handleVolumeListener = () => {
//         volumeChangedByListener.current = true;
//     };
//     let mid = Dimensions.get("screen").width / 2;
//     const right = mid + 100;
//     const left = mid - 100;
//     const screenHeight = Dimensions.get("screen").height;
//     const brightnessVolumeGesture = useMemo(() =>
//         Gesture.Pan()
//             .minVelocityX(0)
//             .onStart((event) => {
//                 if (isLocked || videoSliderVisible) return;
//                 const touchX = event.absoluteX;
//                 if (touchX < mid) {
//                     console.log(`start: ${brightnessVal}`);
//                     setInitialBrightnessVal(brightnessVal);
//                     // showSlider();
//                 } else {
//                     console.log(`volume start: `, systemVol);
//                     setInitVolumeVal(systemVol);
//                     // showVolumeSlider();
//                 }
//             })
//             .onUpdate((event) => {
//                 const touchX = event.absoluteX;
//                 const touchY = event.translationY;
//                 if (isLocked || videoSliderVisible) return;

//                 if (touchX < left) {
//                     let newSliderValue = initialBrightnessVal - touchY / screenHeight;
//                     newSliderValue = Math.max(0, Math.min(1, newSliderValue));

//                     setBrightnessVal(newSliderValue);
//                     showSlider();
//                     // resetHideSliderTimer();
//                 } else if (touchX > right) {
//                     console.log(touchX, mid, "mid right");

//                     let newVolValue = initVolumeVal - touchY / screenHeight;
//                     newVolValue = Math.max(0, Math.min(1, newVolValue));
//                     // setVolumeVal(newVolValue);
//                     setSystemVol(newVolValue);
//                     showVolumeSlider();
//                 }
//             })
//             .onChange((event) => {
//                 const touchX = event.absoluteX;
//                 if (isLocked || videoSliderVisible) return;
//                 if (touchX < left) {
//                     Brightness.setBrightnessAsync(brightnessVal).then(() => {
//                         console.log("Brightness updated asynchronously to: ", brightnessVal);
//                     });
//                     resetHideSliderTimer(); // Keep the slider visible while changing
//                 } else if (touchX > right) {
//                     VolumeManager.setVolume(systemVol, { showUI: false });
//                     resetHideVolumeTimer();
//                 }
//             })
//             .onEnd(() => {
//                 hideSlider();
//                 hideVolumeSlider();
//             })
//             .runOnJS(true)
//     );

//     // Hide or show controls
//     const toggleControls = useCallback(() => {
//         setShowControls((isShowControls) => !isShowControls);
//     }, []);

//     const timeoutRef = useRef(null);

//     const singleTap = Gesture.Tap()
//         .numberOfTaps(1)
//         .onEnd(() => {
//             // handleSingleTap();
//             toggleControls();
//         })
//         .runOnJS(true)
//         .requireExternalGestureToFail(controlsInteraction);

//     const noMoreEpisode = () => {
//         ToastAndroid.show("No more Episodes", ToastAndroid.SHORT);
//     };

//     const handleSingleTap = () => {
//         if (isShowControls) {
//             // Hide controls immediately
//             // clearTimeout(timeoutRef.current);
//             setShowControls(false);
//         } else {
//             // Show controls and set a delay to hide them
//             setShowControls(true);
//             // timeoutRef.current = setTimeout(() => {
//             //     setShowControls(false);
//             // }, 4000); // Adjust the delay as needed
//         }
//     };

//     // 2x speed up long press
//     const speedUp = useMemo(() =>
//         Gesture.LongPress()
//             .minDuration(1000)
//             .onStart(() => {
//                 setVideoRate(2);
//                 ToastAndroid.show("Playing at 2x speed", ToastAndroid.SHORT);
//                 console.log("long presssed");
//             })
//             .onEnd(() => {
//                 setVideoRate(1);
//                 ToastAndroid.show("Playing at normal speed", ToastAndroid.SHORT);
//                 console.log("end press");
//             })
//             .runOnJS(true)
//     );

//     // play next episode
//     const playNextVideo = () => {
//         const newIndex = currentEpisodeIndexRedux + 1;
//         const episodesAll = allEpisodesList[newIndex];
//         if (!isAutoPlayNext) {
//             togglePlayPause();
//             return;
//         }
//         console.log("newIndex:", newIndex);

//         if (newIndex < allEpisodesList?.length) {
//             // const nextEpisode = globalEpisodeList1[selectedChunk1][newIndex];

//             console.log("hey episodesAll", episodesAll);

//             dispatch(
//                 updateEpisode({
//                     currentEpisode: episodesAll,
//                     currentEpisodeNumber: episodesAll.number,
//                     selectedEpisode: episodesAll.id,
//                     currentEpisodeIndex: newIndex,
//                 })
//             );
//         } else {
//             // const nextChunk = selectedChunk1 + 1;
//             // if (nextChunk < globalEpisodeList1.length) {
//             //     const nextEpisode = globalEpisodeList1[nextChunk][0];
//             //     dispatch(
//             //         updateEpisode({
//             //             selectedChunk: nextChunk,
//             //             currentEpisode: globalEpisodeList1[nextChunk][0],
//             //             currentEpisodeNumber: globalEpisodeList1[nextChunk][0].number,
//             //             selectedEpisode: globalEpisodeList1[nextChunk][0].id,
//             //             currentEpisodeIndex: 0,
//             //         })
//             //     );
//             // } else {
//             setIsPlaying(false);
//             videoRef.current.pause();
//             noMoreEpisode();
//             return newIndex;
//             // }
//         }
//     };

//     const controlsInteraction = Gesture.Manual().onStart(() => {
//         console.log("Control interaction started"); // This can be left empty
//     });

//     // play previous episode
//     const playPreviousVideo = () => {
//         const newIndex = currentEpisodeIndexRedux - 1;
//         const episodesAll = allEpisodesList[newIndex];
//         // Check if there are more episodes in the current chunk
//         if (newIndex >= 0) {
//             dispatch(
//                 updateEpisode({
//                     currentEpisode: episodesAll,
//                     currentEpisodeNumber: episodesAll.number,
//                     selectedEpisode: episodesAll.id,
//                     currentEpisodeIndex: newIndex,
//                 })
//             );
//         } else {
//             // const prevChunk = selectedChunk1 - 1;
//             // if (prevChunk >= 0) {
//             //     const lastEpisodeIndex = globalEpisodeList1[prevChunk].length - 1;
//             //     dispatch(
//             //         updateEpisode({
//             //             selectedChunk: prevChunk,
//             //             currentEpisode: globalEpisodeList1[prevChunk][lastEpisodeIndex],
//             //             currentEpisodeNumber: globalEpisodeList1[prevChunk][lastEpisodeIndex].number,
//             //             selectedEpisode: globalEpisodeList1[prevChunk][lastEpisodeIndex].id,
//             //             currentEpisodeIndex: lastEpisodeIndex,
//             //         })
//             //     );
//             // } else {
//             setIsPlaying(false);
//             videoRef.current.pause();
//             noMoreEpisode();
//             return newIndex;
//             // }
//         }
//     };
//     const composedGesture = Gesture.Race(brightnessVolumeGesture, doubleTap, speedUp);
//     const composed = Gesture.Exclusive(speedUp, doubleTap, brightnessVolumeGesture);

//     return (
//         <GestureHandlerRootView style={styles.contianer}>
//             {isLoading ? (
//                 <ActivityIndicatorCustom />
//             ) : (
//                 <GestureDetector gesture={composed}>
//                     <Pressable
//                         style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
//                         onPress={() => {
//                             if (isDoubleTap) return;
//                             toggleControls();
//                         }}
//                     >
//                         <Video
//                             ref={videoRef}
//                             style={styles.videoPlayer}
//                             source={{
//                                 uri: currentUrl,
//                                 type: "m3u8",
//                                 textTracksAllowChunklessPreparation: false,
//                                 textTracks: trackText && [
//                                     {
//                                         title: "English Subs",
//                                         language: "en",
//                                         type: TextTrackType.VTT,
//                                         uri: trackText, // Subtitle file URI
//                                     },
//                                 ],
//                             }}
//                             selectedTextTrack={{
//                                 title: "English Subs",
//                                 value: "en",
//                                 // index: 0,
//                             }}
//                             subtitleStyle={{ paddingBottom: 50, fontSize: 20, opacity: 0.8 }}
//                             showNotificationControls={true}
//                             paused={isPlaying}
//                             controls={false}
//                             muted={false}
//                             rate={videoRate}
//                             volume={1}
//                             resizeMode="contain"
//                             onLoad={(status) => {
//                                 // console.log(`status duration: ${status.duration}`);
//                                 setIsPlaying(false);
//                                 setVideoDuration(status.duration);
//                             }}
//                             onBuffer={() => {
//                                 setIsLoadingQualitySwitch(true);
//                             }}
//                             onLoadStart={async (a) => {
//                                 await ScreenOrientation.lockAsync(
//                                     ScreenOrientation.OrientationLock.LANDSCAPE
//                                 );
//                             }}
//                             onError={(a) => {
//                                 console.log(a.error);
//                             }}
//                             onReadyForDisplay={() => {
//                                 setIsFullscreen(true);
//                             }}
//                             onProgress={(status) => {
//                                 setCurrentTime(status.currentTime);
//                                 setIsLoadingQualitySwitch(false);
//                             }}
//                             onEnd={playNextVideo}
//                         />
//                         {isLoadingQualitySwitch ? (
//                             <ActivityIndicatorCustom
//                                 style={{
//                                     position: "absolute",
//                                     paddingTop: 10,
//                                 }}
//                                 indicatorStyle={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }}
//                             />
//                         ) : (
//                             <></>
//                         )}

//                         <VideoControls
//                             isLoadingQualitySwitch={isLoadingQualitySwitch}
//                             isLocked={isLocked}
//                             isShowControls={isShowControls}
//                             videoDuration={videoDuration}
//                             shouldPlay={isPlaying}
//                             fullScreenValue={isFullscreen}
//                             onToggleLock={toggleLock}
//                             onToggleFullscreen={toggleFullscreen}
//                             onTogglePlayPause={togglePlayPause}
//                             onTogglePlaybackSpeed={togglePlaybackSpeed}
//                             currentTime={currentTime}
//                             onSeek={(value) => {
//                                 videoRef.current.seek(+value);
//                                 setCurrentTime(+value);
//                             }}
//                             onToggleHqModal={toggleHqModal}
//                             onToggleEpisodeModal={toggleEpisodeModal}
//                             onPlayNextVideo={playNextVideo}
//                             onPlayPreviousEpisode={playPreviousVideo}
//                             skipData={skipData}
//                             onToggleSkipIntro={skipIntro}
//                             onToggleSkipOutro={skipEnding}
//                             brightnessVal={brightnessVal}
//                             setBrightnessVal={setBrightnessVal}
//                             brigthControlisVisible={brigthControlisVisible}
//                             setBrigthControlisVisible={setBrigthControlisVisible}
//                             showSlider={showSlider}
//                             hideSlider={hideSlider}
//                             volumeControlVisible={volumeControlVisible}
//                             isVisible={isVisible}
//                             doubleTapVal={doubleTapVal}
//                             videoSliderVisible={videoSliderVisible}
//                             setVideoSliderVisible={setVideoSliderVisible}
//                             volumeVal={volumeVal}
//                             systemVol={systemVol}
//                             setVolumeVal={setVolumeVal}
//                             setSystemVol={setSystemVol}
//                             showVolumeSlider={showVolumeSlider}
//                             hideVolumeSlider={hideVolumeSlider}
//                             handleVolumeListener={handleVolumeListener}
//                             accentColorGlobal={accentColorGlobal}
//                         />
//                     </Pressable>
//                 </GestureDetector>
//             )}
//             <TouchableOpacity
//                 onPress={() => {
//                     toggleHqModal();
//                 }}
//                 style={globalStyles.absoluteStyle}
//             >
//                 <Modal
//                     visible={hqModalIsShow}
//                     // statusBarTranslucent={true}
//                     transparent={true}
//                     onRequestClose={async () => {
//                         setHqModalIsShow(!hqModalIsShow);
//                         StatusBar.setHidden(false);

//                         setIsFullscreen(false);
//                         await ScreenOrientation.unlockAsync();
//                         await ScreenOrientation.getOrientationAsync();

//                         if (ScreenOrientation.Orientation.PORTRAIT_UP) navigation.goBack();
//                     }}
//                 >
//                     <TouchableOpacity
//                         style={styles.modalWrapper}
//                         onPress={() => {
//                             toggleHqModal();
//                         }}
//                     ></TouchableOpacity>
//                     <Animated.View entering={ZoomIn} exiting={ZoomOut} style={styles.childWrapper}>
//                         <View
//                             style={{ borderBottomWidth: 1, borderColor: COLORS.dark_300, paddingBottom: 4 }}
//                         >
//                             <Text style={{ color: COLORS.white_100 }}>Quality</Text>
//                         </View>

//                         <FlatList
//                             data={
//                                 provider === "meta" || provider === "gogoanime"
//                                     ? videoUrl
//                                           .filter((item) => item.quality !== "backup")
//                                           .sort((a, b) => {
//                                               const order = ["Auto", "1080p", "720p", "480p", "360p"]; // Updated order with 'auto'

//                                               return (
//                                                   order.indexOf(
//                                                       a.quality === "default" ? "auto" : a.quality
//                                                   ) -
//                                                   order.indexOf(b.quality === "default" ? "auto" : b.quality)
//                                               );
//                                           })
//                                     : videoUrl?.url
//                             }
//                             keyExtractor={(item, index) => index.toString()}
//                             renderItem={({ item }) => {
//                                 return (
//                                     <TouchableOpacity
//                                         onPress={() => {
//                                             handleChangeQuality(item.quality, item.url);
//                                             setHqModalIsShow(!hqModalIsShow);
//                                         }}
//                                     >
//                                         <Text
//                                             style={[
//                                                 styles.qualityText,
//                                                 selectedQuality && selectedQuality === item.quality
//                                                     ? { color: COLORS.primary_600 }
//                                                     : COLORS.dark_600,
//                                             ]}
//                                         >
//                                             {item.quality === "default" ? "Auto" : item.quality}
//                                         </Text>
//                                     </TouchableOpacity>
//                                 );
//                             }}
//                         ></FlatList>
//                     </Animated.View>
//                 </Modal>
//             </TouchableOpacity>

//             <EpisodeListModal
//                 epModalShow={epModalShow}
//                 onToggleEpisodeModal={toggleEpisodeModal}
//                 // animateVal={animateVal}
//                 onTogglePlayPause={togglePlayPause}
//             />
//         </GestureHandlerRootView>
//     );
// };

// export default WatchScreen;

// const styles = StyleSheet.create({
//     contianer: {
//         flex: 1,
//         backgroundColor: COLORS.dark_100,
//     },
//     videoPlayer: {
//         flex: 1,
//         width: "100%",
//     },
//     modalWrapper: {
//         flex: 1,
//         alignItems: "flex-end",
//         // backgroundColor: "rgba(0,0,0,0.5)",
//     },
//     childWrapper: {
//         position: "absolute",
//         right: 50,
//         bottom: 75,
//         width: 180,
//         height: 150,
//         borderRadius: 10,
//         backgroundColor: COLORS.dark_200,
//         padding: 15,
//     },
//     qualityText: {
//         color: COLORS.dark_600,
//         fontSize: 10,
//         paddingBottom: 5,
//     },
// });
