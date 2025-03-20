import { useState, useRef, useEffect } from 'react';
import { Play, Pause, AlertCircle, Loader2, FileVideo } from 'lucide-react';
import { Button } from './button';

const VideoPlayer = ({ src, poster, title }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const video = videoRef.current;
    if (!video) return;

    // Check if the video source exists
    const checkVideoSource = async () => {
      try {
        const response = await fetch(src, { method: 'HEAD' });
        if (!response.ok) {
          throw new Error(`Video file not found: ${src}`);
        }
      } catch (err) {
        console.error('Video source check failed:', err);
        setError(true);
        setIsLoading(false);
        return;
      }
    };

    checkVideoSource();

    // Preload the video
    video.load();

    const handleLoadedData = () => {
      setIsLoading(false);
      setError(false);
    };

    const handleError = (e) => {
      setIsLoading(false);
      setError(true);
      console.error('Video loading error:', video.error);
      // Log additional error details
      if (video.error) {
        console.error('Error code:', video.error.code);
        console.error('Error message:', video.error.message);
      }
    };

    const handleTimeUpdate = () => {
      if (video.duration) {
        const progress = (video.currentTime / video.duration) * 100;
        setProgress(progress);
      }
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setError(false);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      setIsMounted(false);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [src]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(error => {
          console.error('Error playing video:', error);
          setError(true);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!isMounted) {
    return null;
  }

  if (error) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-muted">
        <FileVideo className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">Video Not Found</h3>
        <p className="text-muted-foreground mb-4">
          The demo video is currently unavailable. Please contact our support team to get access to the demo video.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setError(false);
            setIsLoading(true);
            if (videoRef.current) {
              videoRef.current.load();
            }
          }}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      )}
      
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={poster}
        title={title}
        playsInline
        preload="auto"
        controls={false}
      >
        <source src={src} type="video/mp4" />
        <source src={src.replace('.mp4', '.webm')} type="video/webm" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-white hover:bg-white/20"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
          
          <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer; 