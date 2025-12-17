/**
 * @fileoverview A custom audio player component built using Expo's `expo-av` library.
 * It provides basic playback controls (play/pause), time display, and a progress bar
 * for playing an audio file specified by a URL.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { colors, fontSizes, fontWeights } from 'lib/theme';

/**
 * @interface AudioPlayerProps
 * @description Props for the AudioPlayer component.
 * @property {string} audioUrl The URL of the audio file to be played.
 */
interface AudioPlayerProps {
  audioUrl: string;
}

/**
 * @function AudioPlayer
 * @description Renders a player interface to handle audio playback.
 *
 * @param {AudioPlayerProps} props The props object containing the audio URL.
 * @returns {React.FC<AudioPlayerProps>} The rendered audio player component.
 */
export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  /**
   * @description Cleanup effect: Unload the audio resource when the component unmounts
   * or when the `sound` object changes.
   */
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  /**
   * @description Converts time in milliseconds to a formatted string (m:ss).
   * @param {number} milliseconds The time in milliseconds.
   * @returns {string} The formatted time string.
   */
  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  /**
   * @async
   * @description Handles playing, pausing, and loading the audio file.
   * @returns {Promise<void>}
   * @sideeffect Manages `sound` state, playback status, and loading state.
   */
  const playSound = async () => {
    try {
      setIsLoading(true);
      
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: true },
          (status) => {
            if (status.isLoaded) {
              setIsPlaying(status.isPlaying);
              setPosition(status.positionMillis || 0);
              setDuration(status.durationMillis || 0);
              if (status.didJustFinish) {
                setIsPlaying(false);
                setPosition(0);
              }
            }
          }
        );
        setSound(newSound);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      Alert.alert('Error', 'Failed to play audio file');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * @async
   * @description Changes the current playback position of the audio.
   * @param {number} seekPosition The desired position in milliseconds.
   * @returns {Promise<void>}
   */
  const seekTo = async (seekPosition: number) => {
    if (sound) {
      try {
        await sound.setPositionAsync(seekPosition);
        setPosition(seekPosition);
      } catch (error) {
        console.error('Error seeking:', error);
      }
    }
  };

  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <View style={styles.audioPlayerContainer}>
      <View style={styles.audioPlayer}>
        {/* Play/Pause Button */}
        <TouchableOpacity
          style={styles.playButton}
          onPress={playSound}
          disabled={isLoading}
        >
          <Text style={styles.playButtonText}>
            {isLoading ? '⏳' : isPlaying ? '⏸️' : '▶️'}
          </Text>
        </TouchableOpacity>

        {/* Time Display */}
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>
            {formatTime(position)} / {formatTime(duration)}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progressPercentage}%` }
              ]} 
            />
          </View>
          <TouchableOpacity
            style={styles.progressTouchable}
            onPress={(event) => {
              const { locationX } = event.nativeEvent;
              const progressBarWidth = 200; // Approximate width
              const seekRatio = locationX / progressBarWidth;
              const seekPosition = seekRatio * duration;
              seekTo(seekPosition);
            }}
          />
        </View>

        {/* Volume Icon */}
        <TouchableOpacity style={styles.volumeButton}>
          <Text style={styles.volumeIcon}>🔊</Text>
        </TouchableOpacity>

        {/* Options Menu */}
        <TouchableOpacity style={styles.optionsButton}>
          <Text style={styles.optionsIcon}>⋮</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  audioPlayerContainer: {
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.tertiary,
  },
  audioPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.dark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  playButtonText: {
    fontSize: fontSizes.sm,
    color: colors.white,
  },
  timeContainer: {
    minWidth: 80,
    marginRight: 8,
  },
  timeText: {
    fontSize: fontSizes.sm,
    color: colors.dark,
    fontWeight: fontWeights.medium as any,
  },
  progressContainer: {
    flex: 1,
    marginRight: 8,
    position: 'relative',
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.tertiary,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  progressTouchable: {
    position: 'absolute',
    top: -8,
    left: 0,
    right: 0,
    bottom: -8,
  },
  volumeButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  volumeIcon: {
    fontSize: fontSizes.sm,
  },
  optionsButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsIcon: {
    fontSize: fontSizes.md,
    color: colors.dark,
    fontWeight: fontWeights.bold as any,
  },
});
