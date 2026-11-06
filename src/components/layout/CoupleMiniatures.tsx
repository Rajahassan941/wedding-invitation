/**
 * Hand-drawn SVG miniatures of the couple in white wedding attire.
 * Gold details use `currentColor`, so set the colour with a text-* class.
 */

const SKIN = "#c8956b";
const SKIN_SHADE = "#b07f58";
const HAIR = "#2a1c13";

interface FigureProps {
  className?: string;
}

/** Groom in a white sherwani, white turban and a gold stole. */
export function GroomMiniature({ className }: FigureProps) {
  return (
    <svg viewBox="0 0 40 66" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="groom-cloth" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ece5d6" />
          <stop offset="0.45" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e6dece" />
        </linearGradient>
      </defs>

      <ellipse cx="20" cy="63.5" rx="11" ry="1.8" fill="#000" opacity="0.16" />

      {/* Churidar and mojari */}
      <path d="M15 46h4.2l-.4 15.4h-3.4Z" fill="url(#groom-cloth)" stroke="currentColor" strokeWidth="0.5" />
      <path d="M20.8 46H25l-.4 15.4h-3.4Z" fill="url(#groom-cloth)" stroke="currentColor" strokeWidth="0.5" />
      <path d="M13.6 61.2q2.4-1.2 5.2 0v1.6h-5.6Z" fill="currentColor" />
      <path d="M21.2 61.2q2.8-1.2 5.2 0l.4 1.6h-5.6Z" fill="currentColor" />

      {/* Sleeves */}
      <path d="M12.2 22.6 8.4 38.6q1.2 1.2 2.8.4l3.2-14.6Z" fill="url(#groom-cloth)" stroke="currentColor" strokeWidth="0.5" />
      <path d="m27.8 22.6 3.8 16q-1.2 1.2-2.8.4l-3.2-14.6Z" fill="url(#groom-cloth)" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="9.7" cy="40.2" r="1.5" fill={SKIN} />
      <circle cx="30.3" cy="40.2" r="1.5" fill={SKIN} />

      {/* Sherwani */}
      <path
        d="M15 20.4q5-1.6 10 0l3.6 2.4 2 26q-10.6 2.2-21.2 0l2-26Z"
        fill="url(#groom-cloth)"
        stroke="currentColor"
        strokeWidth="0.6"
      />
      <path d="M20 21v27.4" stroke="currentColor" strokeWidth="0.5" />
      {[25, 28.5, 32, 35.5, 39].map((y) => (
        <circle key={y} cx="20" cy={y} r="0.55" fill="currentColor" />
      ))}
      <path d="M9.6 46.2q10.4 2 20.8 0" fill="none" stroke="currentColor" strokeWidth="0.9" />

      {/* Gold stole over the shoulder */}
      <path d="M14.6 21q1.8 1.6 13 17.4l-2 1.4Q15.6 26.2 12.8 22.8Z" fill="currentColor" opacity="0.85" />

      {/* Collar, neck, head */}
      <rect x="18.3" y="15.6" width="3.4" height="4.4" rx="1" fill={SKIN_SHADE} />
      <path d="M17.2 19.2h5.6l.6 2.2q-3.4 1-6.8 0Z" fill="url(#groom-cloth)" stroke="currentColor" strokeWidth="0.5" />
      <ellipse cx="20" cy="11.6" rx="4.9" ry="5.4" fill={SKIN} />
      <path d="M15.4 12.8q.6 4.4 4.6 4.6 4-.2 4.6-4.6-1.6 2-4.6 2t-4.6-2Z" fill={HAIR} />

      {/* Safa (turban) with jewel and plume */}
      <path
        d="M14.6 10.6q-.8-7.4 5.4-7.6 6.2.2 5.4 7.6-5.4-2-10.8 0Z"
        fill="url(#groom-cloth)"
        stroke="currentColor"
        strokeWidth="0.6"
      />
      <path d="M15.2 8q4.8-2.4 9.6 0" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="20" cy="6.4" r="1.1" fill="currentColor" />
      <path d="M20 5.4q1.6-2.8 3.6-3.2-1 2.2-3.2 3.6Z" fill="currentColor" />
    </svg>
  );
}

/** Bride in a flowing white gown with a white hijab, veil and bouquet. */
export function BrideMiniature({ className }: FigureProps) {
  return (
    <svg viewBox="0 0 40 66" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="bride-cloth" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ece5d6" />
          <stop offset="0.5" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e6dece" />
        </linearGradient>
      </defs>

      <ellipse cx="20" cy="63.5" rx="15" ry="1.8" fill="#000" opacity="0.16" />

      {/* Sheer veil flowing behind */}
      <path d="M14 8Q7 30 5.4 56l6-2Q12 30 16 12Z" fill="#fff" opacity="0.7" stroke="currentColor" strokeWidth="0.3" />
      <path d="M26 8q7 22 8.6 48l-6-2Q28 30 24 12Z" fill="#fff" opacity="0.7" stroke="currentColor" strokeWidth="0.3" />

      {/* Skirt with gold hem */}
      <path
        d="M14.4 30.6Q9 46 4.4 61.6q15.6 3 31.2 0Q31 46 25.6 30.6Z"
        fill="url(#bride-cloth)"
        stroke="currentColor"
        strokeWidth="0.6"
      />
      <path d="M5.4 59.6q14.6 2.8 29.2 0" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <path d="M20 33v26" stroke="currentColor" strokeWidth="0.35" opacity="0.6" />
      <path d="M16.4 34 12 58m11.6-24L28 58" stroke="currentColor" strokeWidth="0.3" opacity="0.45" />

      {/* Bodice */}
      <path d="M14.4 21.6q5.6-1.8 11.2 0l.6 9.4q-6.2 1.6-12.4 0Z" fill="url(#bride-cloth)" stroke="currentColor" strokeWidth="0.6" />
      <path d="M13.8 30.8q6.2 1.6 12.4 0" fill="none" stroke="currentColor" strokeWidth="1" />

      {/* Sleeves curving to the bouquet */}
      <path d="M14.4 21.8q-4 5.6 2.2 11.4l1.6-1.4q-4.4-4.8-1.8-9.8Z" fill="url(#bride-cloth)" stroke="currentColor" strokeWidth="0.5" />
      <path d="M25.6 21.8q4 5.6-2.2 11.4l-1.6-1.4q4.4-4.8 1.8-9.8Z" fill="url(#bride-cloth)" stroke="currentColor" strokeWidth="0.5" />

      {/* Bouquet */}
      <path d="m18.4 35 1.6 4 1.6-4" fill="#7c9a74" />
      <circle cx="18" cy="32.6" r="1.7" fill="#f3dfe0" stroke="currentColor" strokeWidth="0.3" />
      <circle cx="22" cy="32.6" r="1.7" fill="#f3dfe0" stroke="currentColor" strokeWidth="0.3" />
      <circle cx="20" cy="31.2" r="1.8" fill="#fff" stroke="currentColor" strokeWidth="0.3" />
      <circle cx="20" cy="34" r="1.5" fill="#fff" stroke="currentColor" strokeWidth="0.3" />

      {/* Hijab framing the face */}
      <path
        d="M20 4.2q-6.8 0-6.8 7.8l-.8 9.4q7.6 3.2 15.2 0l-.8-9.4q0-7.8-6.8-7.8Z"
        fill="url(#bride-cloth)"
        stroke="currentColor"
        strokeWidth="0.6"
      />
      <ellipse cx="20" cy="12.4" rx="3.7" ry="4.5" fill={SKIN} />
      <ellipse cx="20" cy="12.4" rx="4.2" ry="5" fill="none" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="20" cy="7.2" r="0.8" fill="currentColor" />
      <path d="M13.4 19.6q6.6 2.6 13.2 0" fill="none" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  );
}
