interface VideoPlayerProps {
  src: string;
}

export default function VideoPlayer({ src }: VideoPlayerProps) {
  return (
    <div className="rounded-2xl overflow-hidden border border-sapin/8 shadow-xl shadow-sapin/10 aspect-video bg-sapin/3 max-w-xl mx-auto">
      <video
        key={src}
        src={src}
        controls
        className="w-full h-full object-cover"
      />
    </div>
  );
}
