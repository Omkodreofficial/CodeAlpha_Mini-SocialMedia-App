// client/src/components/AvatarPicker.jsx
export default function AvatarPicker({ current, onPick }) {
  const presets = [
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
    "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&q=80",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&q=80",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&q=80",
  ];

  return (
    <div className="mt-2 flex gap-2">
      {presets.map((p) => (
        <img
          key={p}
          src={p}
          onClick={() => onPick(p)}
          className={`w-12 h-12 rounded-full cursor-pointer border-2 ${
            current === p ? "border-brand" : "border-transparent"
          }`}
        />
      ))}
    </div>
  );
}
