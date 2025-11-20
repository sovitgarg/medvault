import { useState, useRef, useCallback } from 'react';
import { createPreviewURL, revokePreviewURL } from '../utils/fileHelpers';
import type { CapturedImage } from '../types';

export const useCamera = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<CapturedImage | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Use rear camera on mobile
        audio: false,
      });

      setStream(mediaStream);
      setIsActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Failed to access camera. Please check permissions.');
      console.error('Camera error:', err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsActive(false);

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }, [stream]);

  const capturePhoto = useCallback(async (): Promise<CapturedImage | null> => {
    if (!videoRef.current) return null;

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.drawImage(video, 0, 0);

      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], `capture_${Date.now()}.jpg`, {
                type: 'image/jpeg',
              });
              const preview = createPreviewURL(file);
              const captured: CapturedImage = {
                file,
                preview,
                timestamp: Date.now(),
              };

              setCapturedImage(captured);
              resolve(captured);
            } else {
              resolve(null);
            }
          },
          'image/jpeg',
          0.9
        );
      });
    } catch (err) {
      console.error('Capture error:', err);
      return null;
    }
  }, []);

  const clearCapturedImage = useCallback(() => {
    if (capturedImage?.preview) {
      revokePreviewURL(capturedImage.preview);
    }
    setCapturedImage(null);
  }, [capturedImage]);

  return {
    videoRef,
    stream,
    capturedImage,
    isActive,
    error,
    startCamera,
    stopCamera,
    capturePhoto,
    clearCapturedImage,
  };
};
