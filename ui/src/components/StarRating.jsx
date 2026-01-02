export default function StarRating({ value = 0, outOf = 5 }) {
    const v = Math.max(0, Math.min(outOf, Number(value) || 0));
    return (
        <div className="flex gap-1" aria-label={`Rating ${v} of ${outOf}`}>
            {Array.from({ length: outOf }).map((_, i) => (
                <span key={i} className={i < v ? "text-yellow-500" : "text-gray-300"}>
          ★
        </span>
            ))}
        </div>
    );
}
