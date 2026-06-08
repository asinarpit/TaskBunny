import React from 'react';

export const QuoteCard: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-[#4F46E5] to-[#6366F1] text-white rounded-[20px] p-5 shadow-sm relative overflow-hidden group flex flex-col justify-between h-[150px] text-left">
      <div className="relative z-10 space-y-1">
        <span className="text-3xl font-black leading-none opacity-40 select-none font-serif block">“</span>
        <p className="text-xs font-semibold leading-relaxed max-w-[150px] -mt-2">
          The secret of getting ahead is getting started.
        </p>
        <p className="text-[9px] font-bold opacity-80 mt-1">- Mark Twain</p>
      </div>

      {/* vector illustration */}
      <div className="absolute bottom-0 right-0 w-32 h-32 opacity-90 group-hover:scale-105 transition-transform duration-500 pointer-events-none">
        <svg viewBox="0 0 512 512" className="w-full h-full">
          <path
            fill="#E0E7FF"
            d="M238.326,182.793c-14.207,0-26.907,6.444-35.345,16.564c-8.064-20.526-28.042-35.064-51.429-35.064c-27.28,0-49.927,19.777-54.424,45.773c-5.293-3.233-11.513-5.097-18.169-5.097c-19.283,0-34.913,15.632-34.913,34.913c0,19.283,15.632,34.913,34.913,34.913h159.369c25.406,0,46.002-20.596,46.002-46.002C284.328,203.39,263.732,182.793,238.326,182.793z"
          />
          <path
            fill="#EEF2FF"
            d="M65.383,239.884c0-15.552,10.17-28.722,24.22-33.238c-3.359-1.075-6.93-1.675-10.646-1.675c-19.283,0-34.913,15.631-34.913,34.913s15.632,34.913,34.913,34.913h21.339C81.014,274.797,65.383,259.167,65.383,239.884z"
          />
          <polygon fill="#FBBF24" points="455.731,80.131 328.197,48.334 455.731,16.537" />
          <path
            fill="#EEF2FF"
            d="M455.731,181.26c-4.419,0-8.002-3.583-8.002-8.002V8.002c0-4.419,3.583-8.002,8.002-8.002c4.419,0,8.002,3.583,8.002,8.002v165.256C463.733,177.677,460.15,181.26,455.731,181.26z"
          />
          <path
            fill="#A5B4FC"
            d="M511.742,178.659l-1.366-1.917c-28.482-39.974-79.492-39.974-107.975,0L290.618,333.629L511.743,512L511.742,178.659z"
          />
          <path
            fill="#818CF8"
            d="M322.626,333.629l111.784-156.887c10.391-14.583,23.784-23.82,37.983-27.763c-24.723-6.866-51.9,2.372-69.991,27.763L290.618,333.629L469.066,512L322.626,333.629z"
          />
          <path
            fill="#818CF8"
            d="M352.469,277.034c-28.482-39.974-79.492-39.974-107.975,0L77.078,511.999h434.664L352.469,277.034z"
          />
          <path
            fill="#C7D2FE"
            d="M314.486,249.271c-24.723-6.866-51.9,2.372-69.991,27.763L77.078,512h32.008l167.416-234.966C286.894,262.451,300.286,253.213,314.486,249.271z"
          />
          <path
            fill="#C7D2FE"
            d="M185.408,382.062c-19.149-22.106-53.445-22.106-72.594,0L0.257,511.999h297.71L185.408,382.062z"
          />
          <path
            fill="#EEF2FF"
            d="M165.115,368.228c-17.905-6.303-38.842-1.703-52.301,13.835L0.257,512h32.008l112.558-129.938C150.513,375.493,157.546,370.893,165.115,368.228z"
          />
        </svg>
      </div>
    </div>
  );
};

export default QuoteCard;
